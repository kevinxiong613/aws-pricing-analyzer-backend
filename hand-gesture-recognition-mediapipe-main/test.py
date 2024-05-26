import asyncio
import websockets

async def test_websocket():
    uri = "ws://localhost:8765"  # Change the URI to match your server's WebSocket endpoint
    async with websockets.connect(uri) as websocket:
        # Send a test message
        await websocket.send("Test message from WebSocket client")

        # Wait for a response
        response = await websocket.recv()
        print(f"Received response from server: {response}")

asyncio.get_event_loop().run_until_complete(test_websocket())