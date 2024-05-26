import websockets
import asyncio

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
            await websocket.send(response)

    except websockets.exceptions.ConnectionClosedError:
        print("Client connection closed unexpectedly")

    finally:
        print("Client disconnected")

# Create and start the WebSocket server
start_server = websockets.serve(handler, "127.0.0.1", 5002)
print("what")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()