import http.server
import ssl

class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<html><body><h1>Hello, HTTPS!</h1></body></html>')

httpd = http.server.HTTPServer(('localhost', 4443), SimpleHTTPRequestHandler)

# Wrap the HTTP server socket with SSL
httpd.socket = ssl.wrap_socket(httpd.socket,
                               keyfile="key.pem",
                               certfile='cert.pem',
                               server_side=True)

print("Serving on https://localhost:4443")
httpd.serve_forever()
