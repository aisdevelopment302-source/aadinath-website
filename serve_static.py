"""
Minimal static server that serves Next.js prerendered pages.
Maps: / → .next/server/app/index.html
      /about-us → .next/server/app/about-us.html
      /_next/* → .next/static/*
      /images/* → public/images/*
"""
import http.server
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))

ROUTES = {
    '/': '.next/server/app/index.html',
    '/about-us': '.next/server/app/about-us.html',
    '/products': '.next/server/app/products.html',
    '/contact-us': '.next/server/app/contact-us.html',
    '/verify': '.next/server/app/verify.html',
}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE, **kwargs)

    def do_GET(self):
        # Rewrite /_next/static/* to .next/static/*
        if self.path.startswith('/_next/static/'):
            self.path = '/.next/static/' + self.path[len('/_next/static/'):]
            return super().do_GET()
        # Rewrite /images/* to public/images/*
        if self.path.startswith('/images/'):
            self.path = '/public/images/' + self.path[len('/images/'):]
            return super().do_GET()
        # Route pages
        clean = self.path.split('?')[0].rstrip('/')
        if clean == '':
            clean = '/'
        if clean in ROUTES:
            self.path = '/' + ROUTES[clean]
            return super().do_GET()
        return super().do_GET()

    def guess_type(self, path):
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.js'):
            return 'application/javascript'
        return super().guess_type(path)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3001
    server = http.server.HTTPServer(('0.0.0.0', port), Handler)
    print(f'Serving on http://localhost:{port}')
    server.serve_forever()
