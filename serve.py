#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import functools


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description="Serve the Erica portfolio locally.")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind. Default: 127.0.0.1")
    parser.add_argument("--port", default=8000, type=int, help="Port to bind. Default: 8000")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent
    handler = functools.partial(NoCacheHandler, directory=str(root))
    server = ThreadingHTTPServer((args.host, args.port), handler)

    print(f"Serving {root}")
    print(f"Open http://{args.host}:{args.port}/")
    print("Press Ctrl+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
