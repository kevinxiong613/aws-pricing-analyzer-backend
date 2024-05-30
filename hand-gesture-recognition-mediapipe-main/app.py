import asyncio
import websockets
import io

from PIL import Image
import numpy as np
import csv # To parse CSV file
import copy # Generic copying operations
from collections import Counter
from collections import deque

import cv2 as cv # Import OpenCV python loader
import mediapipe as mp # Google mediapipe


from helper import get_args, calc_bounding_rect, calc_landmark_list, pre_process_landmark  # Helper methods from helper.py
from model import KeyPointClassifier


async def handler(websocket, path):
    # Argument parsing #################################################################
    args = get_args()

    use_static_image_mode = args.use_static_image_mode
    min_detection_confidence = args.min_detection_confidence
    min_tracking_confidence = args.min_tracking_confidence

    # Model load #############################################################
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=use_static_image_mode,
        max_num_hands=2,
        min_detection_confidence=min_detection_confidence,
        min_tracking_confidence=min_tracking_confidence,
    )

    keypoint_classifier = KeyPointClassifier()

    # Read labels ###########################################################
    with open('model/keypoint_classifier/keypoint_classifier_label.csv',
            encoding='utf-8-sig') as f:
        keypoint_classifier_labels = csv.reader(f)
        keypoint_classifier_labels = [
            row[0] for row in keypoint_classifier_labels
        ]
    async for message in websocket:

        # Convert binary data to a PIL image
        image = Image.open(io.BytesIO(message))
        image = cv.cvtColor(np.array(image), cv.COLOR_RGB2BGR)

        debug_image = copy.deepcopy(image)

        # Print the image size as an example of processing
        print(f"Received image with size: {image.size}")

        # Detection implementation #############################################################
        image = cv.cvtColor(image, cv.COLOR_BGR2RGB)

        image.flags.writeable = False
        results = hands.process(image)
        image.flags.writeable = True

        #  ####################################################################
        if results.multi_hand_landmarks is not None:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks,
                                                results.multi_handedness):
                # Bounding box calculation
                brect = calc_bounding_rect(debug_image, hand_landmarks)
                # Landmark calculation
                landmark_list = calc_landmark_list(debug_image, hand_landmarks)

                # Conversion to relative coordinates / normalized coordinates
                pre_processed_landmark_list = pre_process_landmark(
                    landmark_list)

                # Hand sign classification
                hand_sign_id = keypoint_classifier(pre_processed_landmark_list)
                print("Hand sign id", hand_sign_id)
                # asyncio.run(send_data(str(hand_sign_id)))
                await websocket.send(str(hand_sign_id))
            else:
                await websocket.send("0")
    

async def main():
    async with websockets.serve(handler, "localhost", 5002):
        print("WebSocket server started on ws://localhost:5002")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())