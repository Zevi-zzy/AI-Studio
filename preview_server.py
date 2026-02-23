import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = "dist"

# 切换到 dist 目录，这样 SimpleHTTPRequestHandler 默认就在这里工作
if os.path.exists(DIRECTORY):
    os.chdir(DIRECTORY)
else:
    print(f"Error: Directory '{DIRECTORY}' not found.")
    sys.exit(1)

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 获取请求对应的本地路径
        # 因为我们已经 chdir 到 dist，所以 translate_path 会基于当前目录
        path = self.translate_path(self.path)
        
        # 如果是文件，直接返回
        if os.path.exists(path) and os.path.isfile(path):
            super().do_GET()
            return
            
        # 如果是目录，检查是否有 index.html
        if os.path.exists(path) and os.path.isdir(path):
            if os.path.exists(os.path.join(path, "index.html")):
                super().do_GET()
                return

        # 否则（文件不存在，或者是不含 index.html 的目录），返回 SPA 入口
        # 将路径重写为 /index.html
        self.path = '/index.html'
        super().do_GET()

# 允许地址重用
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
    print(f"Serving SPA at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
