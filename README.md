# Puente Digital - Plataforma Educativa de Alfabetización Digital

> **Trabajo Integrador Final**  
> **Integrantes del Equipo:**
> - Calogerópulos Alexandro
> - Centurión Tomás Gabriel
> - Centurion Valeria Analia
> - Mari Rony Sebastián
> - Rodríguez Santiago Adrián

---

## 📌 Descripción del Proyecto

**Puente Digital** es una plataforma web educativa diseñada para reducir la brecha digital en **personas mayores**, promoviendo su autonomía, seguridad y confianza en el uso de teléfonos inteligentes, computadoras e Internet.

La plataforma se estructura en:
1. **Identidad de Marca y Logo Oficial**: Isotipo de puente arquitectónico y nodos de conexión tecnológica con tipografía gerontológica accesible.
2. **Página Principal de Bienvenida**: Espacio cálido que recibe al visitante, transmite tranquilidad (*"Tocar la pantalla no rompe nada y todo tiene marcha atrás"*), exhibe métricas de impacto (+1.200 alumnos, 3 niveles, 100% gratuito, soporte humano) y ofrece tres vías de acceso sencillas.
3. **Sistema de Acceso para Adultos Mayores**:
   - 🔑 **Iniciar Sesión**: Acceso con el usuario de prueba predeterminado:
     - **Usuario:** `RONY`
     - **Contraseña:** `RONY`
     - *(Incluye un botón de acceso rápido de 1 clic para entrar sin teclear).*
   - 📝 **Registrarme**: Formulario simple y accesible (nombre, usuario y contraseña fácil).
   - 📞 **Pedir a Soporte que cree mi cuenta**: Opciones de llamada gratuita al 0800 y WhatsApp para que un tutor cree la cuenta del alumno.
4. **Aula Virtual y Curso Estrella Desarrollado en Profundidad**:
   - **Curso:** *"Cómo Descargar e Instalar Aplicaciones Seguras en tu Celular (Play Store / App Store)"*.
   - **4 Lecciones Paso a Paso**: Desde encontrar el ícono del triángulo de colores hasta abrir y ubicar la nueva app.
   - **Simulador Interactivo de Google Play Store**: Teléfono en pantalla donde el alumno busca una app oficial (ej: PAMI Móvil), aprende a diferenciarla de anuncios engañosos o patrocinados, presiona "Instalar", ve la descarga en tiempo real y la abre.
   - **Evaluación de Comprobación de Conocimientos**: Cuestionario interactivo de 3 preguntas con retroalimentación inmediata.
   - **Certificado Digital de Logro**: Diploma imprimible personalizado a nombre del alumno (ej: *Rony*), con sellos dorados y firmas pedagógicas del equipo.
5. **Talleres de Práctica Interactivos ("Aprender Haciendo")**:
   - **Detector de Estafas**: Mensajes simulados de sorteos falsos, bancos y cuentos del tío digital vs. turnos médicos reales.
   - **Simulador de WhatsApp**: Teléfono interactivo para conversar con la nieta Sofía con respuestas guiadas y doble tilde azul.

---

## 🎯 Objetivo SMART

> *"Diseñar y desarrollar, durante el período de realización del Trabajo Integrador, un prototipo de una plataforma educativa de alfabetización digital dirigida inicialmente a personas mayores, organizada en tres niveles de aprendizaje —introductorio, medio y avanzado—, que incluya contenidos y actividades prácticas orientadas al uso autónomo y seguro de herramientas digitales de la vida cotidiana."*

---

## 📁 Estructura del Código

```text
PUENTE DIGITAL/
├── index.html            # Página de bienvenida, aula virtual, simuladores y certificados
├── manifest.json         # Manifiesto PWA para instalación móvil
├── sw.js                 # Service Worker para funcionamiento offline
├── server.js             # Servidor HTTP local Node.js
├── iniciar_servidor.bat  # Acceso directo para iniciar el servidor en Windows
├── .gitignore            # Exclusiones de control de versiones
├── css/
│   └── styles.css        # Sistema de diseño responsivo, accesibilidad gerontológica y alto contraste
├── js/
│   ├── courses-data.js   # Catálogo completo de cursos, lecciones, simuladores y evaluación
│   ├── storage-service.js# Persistencia local (progreso, logros, preferencias y certificados)
│   ├── ai-service.js     # Motor pedagógico de acompañamiento por voz e inteligencia
│   └── app.js            # Lógica interactiva, autenticación, simuladores y modales
├── assets/
│   ├── logo-puente-digital.png # Logotipo oficial en mapa de bits
│   ├── logo-puente-digital.svg # Logotipo vectorial oficial
│   ├── favicon.svg             # Icono de pestaña
│   ├── hero-seniors.jpg        # Fotografía de adultos mayores en portada
│   └── hero-seniors.png        # Ilustración complementaria
└── README.md             # Documentación del proyecto
```

---

## 🚀 Cómo Abrir y Probar la Plataforma

### Opción A: Con Servidor Local (Recomendado para PWA y Sonido)
1. Haz doble clic en `iniciar_servidor.bat` (o ejecuta `node server.js` en tu terminal).
2. Abre tu navegador en **http://localhost:3000**.

### Opción B: Directo en el Navegador
1. Haz doble clic en el archivo `index.html`.
2. Se abrirá de inmediato en tu navegador preferido (Chrome, Edge, Firefox, etc.).

### 🔑 Prueba Rápida con Usuario de Evaluación
- Presiona **"Ingresar"** en la barra superior o en la portada.
- Presiona el botón verde **"⚡ Probar acceso rápido como RONY (1 clic)"** (Usuario: `RONY`, Contraseña: `RONY`).
- ¡Listo! Podrás recorrer los cursos, practicar en los simuladores interactivos de Play Store y WhatsApp, consultar a tu Compañero Digital y obtener tu Certificado de Logro.
