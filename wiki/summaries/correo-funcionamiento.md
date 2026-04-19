---
title: Funcionamiento del Correo Electrónico
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, smtp, protocolos, flujo]
---

# Funcionamiento del Correo Electrónico

## Resumen de una línea
Viaje de un correo desde el cliente de envío hasta la bandeja del receptor: paso a paso.

## Viaje de un Correo Electrónico

### De Extremo a Extremo

**1. Usuario A escribe y envía en su MUA**
- Usa cliente de correo (Outlook, Thunderbird, etc.)
- Conecta al servidor SMTP de su proveedor (puerto 587)
- Autentica con usuario/contraseña
- Envía el mensaje

**2. Servidor SMTP de A lo recibe**
- MTA analiza dirección destino: usuario@dominioB.com
- Consulta registros MX en DNS para dominioB.com
- Determina la dirección IP del servidor de B
- Abre conexión SMTP al servidor de B (puerto 25)

**3. Servidor SMTP de B lo recibe**
- Valida que usuario exista en dominioB.com
- Entrega el correo al MDA (agente de entrega)
- MDA almacena en buzón del usuario

**4. Usuario B lo recupera**
- Se conecta al servidor (vía POP3 o IMAP)
- Descarga el correo (POP3) o sincroniza (IMAP)
- Lee el mensaje en su MUA

### Diagrama Flujo

```
A (MUA)
  └─ SMTP 587 ─> Servidor A (MTA)
                  └─ DNS lookup MX
                  └─ SMTP 25 ─> Servidor B (MTA)
                              └─ MDA (entrega)
                              └─ Almacén buzón
                                 └─ POP3/IMAP <─ B (MUA)
```

## Fallos Posibles

### En Envío (Servidor A)
- Autenticación fallida
- Usuario no autorizado
- Límite de cuota excedido

### En Tránsito
- Servidor destino no responde
- DNS no resuelve MX
- Firewall bloquea puerto 25

### En Recepción (Servidor B)
- Usuario no existe
- Buzón lleno
- Servidor rechaza por SPF/DKIM/DMARC

## Reintento Automático

Si falla la entrega:
- El servidor A guarda en cola
- Reintenta cada N minutos (típicamente: 5min, 30min, 1h, etc.)
- Tras X días (típicamente 5): rebota (devuelve al remitente)

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — Agentes implicados
- [[correo-envio-local|Envío Local de Correos]] — Caso local
- [[correo-envio-a-internet|Envío a Internet]] — Caso externo

## Fuentes
- [¿Cómo Mandamos y Recuperamos un Correo?](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo1/funcionamiento.md) — Proceso técnico detallado
