---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [http]
aliases: [HTTP, HTTP/1.1, Protocolo HTTP]
---

# HTTP

## Resumen de una línea
Protocolo de comunicación cliente-servidor request/response basado en texto plano, sin estado, para transferencia de documentos web.

## Definición

**HTTP** (HyperText Transfer Protocol) = Protocolo de transferencia estándar para web. Cliente envía petición (request) con método HTTP, servidor responde con código estado + contenido (response). Sin manejo de estado (cada petición es independiente).

Versión actual: HTTP/1.1 (con pipelining, persistent connections). HTTP/2 y HTTP/3 son mejoras de rendimiento.

## Modelo Request/Response

```
Cliente                           Servidor
   |                                |
   |------- HTTP REQUEST ---------->|
   |  (línea + headers + body)      |
   |                                |
   |<------ HTTP RESPONSE -----------|
   |  (status + headers + body)     |
   |                                |
```

## Métodos HTTP

| Método | Propósito | Datos | Idempotente | Cacheble |
|--------|-----------|-------|------------|----------|
| GET    | Obtener recurso | URL | Sí | Sí |
| HEAD   | GET sin body | URL | Sí | Sí |
| POST   | Enviar datos | Body | No | Condicional |
| PUT    | Almacenar recurso | Body | Sí | No |
| DELETE | Eliminar recurso | URL | Sí | No |
| PATCH  | Actualización parcial | Body | No | No |
| OPTIONS | Métodos permitidos | — | Sí | No |

**Idempotente** = múltiples ejecuciones = 1 ejecución
**Cacheble** = respuesta almacenable en proxy/navegador

## Códigos de Estado

```
1xx (Informativo)
  100 Continue
  101 Switching Protocols

2xx (Éxito)
  200 OK
  201 Created
  204 No Content
  206 Partial Content (ranges)

3xx (Redirección)
  301 Moved Permanently
  302 Found
  304 Not Modified
  307 Temporary Redirect

4xx (Error cliente)
  400 Bad Request
  401 Unauthorized
  403 Forbidden
  404 Not Found
  405 Method Not Allowed
  429 Too Many Requests

5xx (Error servidor)
  500 Internal Server Error
  502 Bad Gateway
  503 Service Unavailable
  504 Gateway Timeout
```

## Estructura Mensaje

### REQUEST
```
GET /index.html HTTP/1.1
Host: www.ejemplo.com
User-Agent: Mozilla/5.0
Accept: text/html
Accept-Language: es-ES
Connection: keep-alive

[cuerpo opcional, típicamente vacío en GET]
```

### RESPONSE
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Set-Cookie: session=abc123; Path=/
Cache-Control: max-age=3600
Connection: keep-alive

<html>...</html>
```

## Cabeceras Comunes

**Request:**
- `Host` — Servidor destino (obligatorio en HTTP/1.1)
- `User-Agent` — Cliente (navegador, bot)
- `Accept` — Tipos contenido aceptados
- `Accept-Encoding` — Compresión (gzip, deflate)
- `Authorization` — Credenciales (Basic, Bearer)
- `Cookie` — Datos persistentes cliente
- `Referer` — Página origen

**Response:**
- `Content-Type` — Tipo contenido (text/html, application/json)
- `Content-Length` — Tamaño body
- `Set-Cookie` — Cookie almacenar en cliente
- `Cache-Control` — Estrategia caché (max-age, no-cache)
- `Location` — Destino redirección (3xx)
- `WWW-Authenticate` — Autenticación requerida (401)
- `Server` — Servidor (Apache/2.4.41)

## Características

### Stateless
Servidor no retiene estado cliente. Cada petición independiente.
**Solución:** Cookies, sesiones, tokens (almacenados en cliente).

### Connection Modes
```
HTTP/1.0: Cierra conexión tras cada response
HTTP/1.1: Keep-Alive (reutiliza conexión TCP)
         Pipelining (múltiples requests sin esperar response)
HTTP/2:   Multiplexing (interleaving requests/responses)
HTTP/3:   QUIC (UDP, más rápido)
```

### Negociación de Contenido
Cliente especifica preferencias, servidor elige formato óptimo:
```
Accept: text/html, application/xhtml+xml, image/webp
Accept-Language: es-ES, es;q=0.9, en;q=0.8
Accept-Encoding: gzip, deflate, br

→ Servidor responde con más aceptable
```

## Relaciones

### Implementado por
- [[apache]] — Apache HTTP Server v2.4
- [[kubernetes]] — Ingress/Services exponen HTTP
- [[openshift]] — Routes + ingress HTTP(S)

### Complementado por
- [[tls]] — HTTPS (HTTP sobre TLS/SSL)
- [[redes]] — TCP/IP transporte

## Fuentes

- [RFC 7231: HTTP/1.1 Semantics (Methods, Status Codes)](https://tools.ietf.org/html/rfc7231)
- [RFC 7230: HTTP/1.1 Message Syntax](https://tools.ietf.org/html/rfc7230)
- [MDN HTTP Overview](https://developer.mozilla.org/es/docs/Web/HTTP)
- Curso Apache 2.4 (PLEDIN)
