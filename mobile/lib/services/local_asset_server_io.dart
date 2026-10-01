import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class LocalAssetServer {
  HttpServer? _server;
  int? port;
  final Map<String, Uint8List> _cache = {};

  Future<int> start() async {
    _server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    port = _server!.port;
    _server!.listen(_handleRequest);
    debugPrint('LocalAssetServer running at http://127.0.0.1:$port');
    return port!;
  }

  Future<void> stop() async {
    await _server?.close(force: true);
    _server = null;
    port = null;
    _cache.clear();
  }

  Future<void> _handleRequest(HttpRequest request) async {
    try {
      String path = request.uri.path;
      if (path.isEmpty || path == '/') {
        path = '/index.html';
      }

      String assetPath = 'assets/web$path';
      Uint8List? bytes = _cache[assetPath];

      if (bytes == null) {
        try {
          final ByteData data = await rootBundle.load(assetPath);
          bytes = data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
          _cache[assetPath] = bytes;
        } catch (_) {
          // SPA Routing Fallback: If not a static file with an extension, fallback to index.html
          if (!path.contains('.')) {
            assetPath = 'assets/web/index.html';
            bytes = _cache[assetPath];
            if (bytes == null) {
              final ByteData data = await rootBundle.load(assetPath);
              bytes = data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
              _cache[assetPath] = bytes;
            }
          } else {
            request.response.statusCode = HttpStatus.notFound;
            await request.response.close();
            return;
          }
        }
      }

      // Fast 304 Not Modified check via simple length-hash ETag
      final etag = '"${bytes.length}-${assetPath.hashCode}"';
      if (request.headers.value(HttpHeaders.ifNoneMatchHeader) == etag) {
        request.response.statusCode = HttpStatus.notModified;
        await request.response.close();
        return;
      }

      final contentType = _getContentType(assetPath);
      request.response.headers.contentType = contentType;
      request.response.headers.set(HttpHeaders.etagHeader, etag);
      request.response.headers.add('Access-Control-Allow-Origin', '*');
      if (assetPath.contains('/assets/')) {
        request.response.headers.set(HttpHeaders.cacheControlHeader, 'public, max-age=31536000, immutable');
      } else {
        request.response.headers.set(HttpHeaders.cacheControlHeader, 'public, max-age=3600');
      }
      request.response.add(bytes);
      await request.response.close();
    } catch (e) {
      request.response.statusCode = HttpStatus.internalServerError;
      await request.response.close();
    }
  }

  ContentType _getContentType(String path) {
    final lower = path.toLowerCase();
    if (lower.endsWith('.html')) return ContentType.html;
    if (lower.endsWith('.js') || lower.endsWith('.mjs')) {
      return ContentType('application', 'javascript', charset: 'utf-8');
    }
    if (lower.endsWith('.css')) {
      return ContentType('text', 'css', charset: 'utf-8');
    }
    if (lower.endsWith('.json') || lower.endsWith('.webmanifest')) {
      return ContentType.json;
    }
    if (lower.endsWith('.png')) return ContentType('image', 'png');
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return ContentType('image', 'jpeg');
    if (lower.endsWith('.webp')) return ContentType('image', 'webp');
    if (lower.endsWith('.svg')) return ContentType('image', 'svg+xml');
    if (lower.endsWith('.ico')) return ContentType('image', 'x-icon');
    if (lower.endsWith('.mp3')) return ContentType('audio', 'mpeg');
    if (lower.endsWith('.wav')) return ContentType('audio', 'wav');
    if (lower.endsWith('.woff2')) return ContentType('font', 'woff2');
    if (lower.endsWith('.woff')) return ContentType('font', 'woff');
    if (lower.endsWith('.ttf')) return ContentType('font', 'ttf');
    return ContentType.binary;
  }
}
