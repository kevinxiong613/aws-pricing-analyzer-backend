import websockets
import asyncio
from app import process_gestures

async def handler(websocket, path):
    print("Client connected")

    try:
        # Handle messages from the client
        async for message in websocket:
            print(f"Received message from client: {message}")
            # Process the message (e.g., parse, validate, perform operations)
            # Here, you can put your logic to process the message

            # Send a response back to the client
            response = "Message received"
            try:
                await websocket.send(response)
            except websockets.exceptions.ConnectionClosedOK:
                print("Connection closed gracefully, cannot send response")
                break
            except websockets.exceptions.ConnectionClosedError as e:
                print(f"Connection closed with error: {e}")
                break

    except websockets.exceptions.ConnectionClosedError:
        print("Client connection closed unexpectedly")

    finally:
        print("Client disconnected")

# Function to start WebSocket server
async def start_server():
    server = await websockets.serve(handler, "127.0.0.1", 5002)
    await server.wait_closed()


# Entry point to start both WebSocket server and main function
async def main_wrapper():
    loop = asyncio.get_event_loop()

    # Start WebSocket server
    ws_server = loop.create_task(start_server())

    # Run your main processing function in a separate thread to avoid blocking the event loop
    loop.run_in_executor(None, process_gestures)

    # Wait for the WebSocket server to close (which should never happen in this example)
    await ws_server

# Run the main wrapper function
if __name__ == "__main__":
    asyncio.run(main_wrapper())