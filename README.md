# Entre Dos

Diagnóstico orientativo de comunicación en pareja creado para el reto **La forma más creativa de capturar leads**.

La persona responde 10 preguntas breves, descubre su perfil de comunicación y recibe valor antes de entregar información. Después puede dejar su correo para desbloquear señales, tres ejercicios prácticos y una recomendación personalizada para los próximos siete días. El lead se guarda realmente en Supabase.

## Perfiles

- Conexión consciente
- Conversaciones postergadas
- Comunicación defensiva
- Distancia emocional

## Privacidad

Las respuestas individuales se procesan en el navegador y no se almacenan. La base de datos conserva únicamente el correo, el perfil obtenido, el consentimiento opcional y la fecha. La herramienta es educativa y no reemplaza terapia psicológica.

## Stack

- Next.js
- Vercel
- Supabase (Postgres + RLS)

## Proyecto público

[Probar Entre Dos](https://entre-dos-git-main-agfs-projects.vercel.app)

## Configuración

Ejecuta `supabase.sql` en Supabase y configura en Vercel:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
