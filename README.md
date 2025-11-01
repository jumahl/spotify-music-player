# Spotify Player para Raycast (Windows)

Extensión de Raycast para controlar Spotify en Windows usando la Spotify Web API.

## 🎵 Características

Esta extensión te permite controlar Spotify directamente desde Raycast en Windows:

- **Now Playing**: Ver información detallada de la canción actual con portada del álbum
- **Toggle Play/Pause**: Pausar o reanudar la reproducción
- **Next Track**: Saltar a la siguiente canción
- **Previous Track**: Volver a la canción anterior
- **Volume Up/Down**: Aumentar o disminuir el volumen en incrementos de 10%
- **Like Track**: Agregar la canción actual a tus "Me gusta"
- **Copy URL**: Copiar el enlace de Spotify de la canción actual

## 📋 Requisitos

- **Spotify Premium**: Necesitas una suscripción Premium para controlar la reproducción
- **Raycast para Windows**: Beta de Raycast para Windows
- **Dispositivo Spotify activo**: La app de Spotify (escritorio, móvil o web) debe estar reproduciendo música

## 🚀 Instalación

### Desarrollo Local

1. Clona o descarga este repositorio
2. Abre el directorio en la terminal
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el modo desarrollo:
   ```bash
   npm run dev
   ```
5. Raycast se abrirá automáticamente y detectará la extensión

### Primera Configuración

1. La primera vez que uses cualquier comando, se te pedirá autenticarte con Spotify
2. Haz clic en "Authorize" y sigue las instrucciones en el navegador
3. Acepta los permisos solicitados
4. ¡Listo! Ya puedes usar todos los comandos

## 🎮 Comandos Disponibles

### Now Playing

Muestra información detallada de lo que está sonando:

- Portada del álbum
- Nombre de la canción
- Artista
- Álbum
- Duración
- Acciones rápidas (Play/Pause, Next, Previous, Abrir en Spotify)

**Atajos de teclado:**

- `Cmd + →`: Siguiente canción
- `Cmd + ←`: Canción anterior
- `Cmd + R`: Actualizar información
- `Cmd + O`: Abrir en Spotify

### Toggle Play/Pause

Pausa o reanuda la reproducción con un solo comando.

### Next Track

Salta a la siguiente canción en la cola.

### Previous Track

Vuelve a la canción anterior.

### Volume Up

Aumenta el volumen en 10% (máximo 100%).

### Volume Down

Disminuye el volumen en 10% (mínimo 0%).

### Like Current Track

Agrega la canción actual a tu biblioteca "Canciones que te gustan".

### Copy Track URL

Copia el enlace de Spotify de la canción actual al portapapeles.

## 🛠️ Desarrollo

### Estructura del Proyecto

```
spotify-music-player/
├── src/
│   ├── api/                    # Funciones de la API de Spotify
│   │   ├── oauth.ts            # Configuración OAuth
│   │   ├── getCurrentlyPlaying.ts
│   │   ├── getPlaybackState.ts
│   │   ├── play.ts
│   │   ├── pause.ts
│   │   └── ...
│   ├── helpers/                # Utilidades
│   │   ├── spotify.api.ts      # Cliente API generado
│   │   ├── withSpotifyClient.tsx
│   │   └── getError.ts
│   ├── hooks/                  # React hooks
│   │   ├── useCurrentlyPlaying.ts
│   │   └── usePlaybackState.ts
│   ├── components/             # Componentes React
│   │   └── View.tsx
│   └── [comandos].ts/tsx       # Comandos de Raycast
├── assets/
│   └── spotify-icon.svg
└── package.json
```

### Scripts Disponibles

```bash
# Modo desarrollo (hot reload)
npm run dev

# Compilar
npm run build

# Lint
npm run lint

# Fix lint
npm run fix-lint
```

## 🔧 Arquitectura Técnica

Esta extensión usa **Spotify Web API** en lugar de AppleScript (que solo funciona en Mac). Esto significa que:

✅ **Funciona en Windows** (y también funcionaría en Linux si Raycast lo soporta)  
✅ **No depende de la app de escritorio** - Puede controlar cualquier dispositivo Spotify  
✅ **Más características disponibles** - Acceso completo a la API de Spotify  
✅ **Más confiable** - No depende de scripting del sistema operativo

### Autenticación

Se usa OAuth 2.0 con PKCE (Proof Key for Code Exchange) para una autenticación segura sin necesidad de almacenar secretos en el cliente.

### Permisos (Scopes)

La extensión solicita los siguientes permisos:

- `playlist-modify-private` - Modificar playlists privadas
- `playlist-modify-public` - Modificar playlists públicas
- `playlist-read-collaborative` - Leer playlists colaborativas
- `playlist-read-private` - Leer playlists privadas
- `user-follow-read` - Leer artistas seguidos
- `user-library-modify` - Modificar biblioteca (Me gusta)
- `user-library-read` - Leer biblioteca
- `user-modify-playback-state` - Controlar reproducción
- `user-read-currently-playing` - Ver canción actual
- `user-read-playback-state` - Ver estado de reproducción
- `user-read-private` - Leer perfil privado
- `user-top-read` - Leer top artistas/canciones

## ⚠️ Limitaciones

- **Requiere Spotify Premium**: El control de reproducción solo está disponible para usuarios Premium
- **Dispositivo activo necesario**: Debe haber un dispositivo Spotify reproduciendo música (puede ser móvil, escritorio o web)
- **Rate limiting**: La API de Spotify tiene límites de peticiones por segundo

## 🐛 Solución de Problemas

### "No active device"

- Asegúrate de que Spotify está reproduciendo música en algún dispositivo
- Abre la app de Spotify (escritorio, móvil o web) y reproduce algo

### "Nothing is currently playing"

- Inicia la reproducción en Spotify primero
- Usa el comando "Now Playing" para verificar

### Errores de autenticación

- Revoca el acceso en tu [configuración de Spotify](https://www.spotify.com/account/apps/)
- Vuelve a ejecutar cualquier comando para re-autenticar

### La extensión no aparece en Raycast

- Asegúrate de estar en modo desarrollo: `npm run dev`
- Verifica que Raycast esté actualizado
- Revisa los logs de Raycast para errores

## 📝 Licencia

MIT

## 🙏 Créditos

Basado en la extensión original [Spotify Player](https://github.com/raycast/extensions/tree/main/extensions/spotify-player) del repositorio de Raycast, adaptada para funcionar en Windows usando la Spotify Web API.
