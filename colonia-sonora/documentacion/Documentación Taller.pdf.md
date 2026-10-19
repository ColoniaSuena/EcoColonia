# Especificación de requisitos de software

Proyecto: Sistema de información web interactivo para la difusión del patrimonio histórico, cultural y musical de Colonia del Sacramento.

## Sofia Rodriguez, Sol Mendez, Agustin Muñoz, Lucas Aguiar, Matias Otte

## Profesor Noelia Gonzales

## Asignatura: Taller integrador de sistemas

## Centro Regional de Profesores del Suroeste

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.** **Especificación de requisitos de software.** **23 Octubre 2026**

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

**1 Introducción:....................................................................................................................................... 3**

1.1. Propósito..................................................................................................................................... 3
1.2. Ámbito del Sistema.................................................................................................................... 4
1.3. Definiciones, Acrónimos y Abreviaturas................................................................................... 5
1.4. Referencias................................................................................................................................. 5
**2. Descripción General...........................................................................................................................5**
2.2. Funciones del Producto.............................................................................................................. 6
2.3. Características de los Usuarios................................................................................................... 6
2.4. Restricciones...............................................................................................................................7
2.5. Suposiciones y Dependencias.....................................................................................................7
2.6. Requisitos Futuros...................................................................................................................... 7
**3. Requisitos Específicos........................................................................................................................ 8**
3.1. Interfaces Externas..................................................................................................................... 8
3.2. Funciones....................................................................................................................................8
3.3. Requisitos de Rendimiento......................................................................................................... 8
3.4. Restricciones de Diseño..............................................................................................................8
3.5. Atributos del Sistema..................................................................................................................8
3.6. Otros Requisitos......................................................................................................................... 8
**4. Apéndices............................................................................................................................................ 8**
Canciones sobre Colonia del Sacramento......................................................................................... 8
Artistas de Colonia.......................................................................................................................... 10
Videoclips grabados en Colonia del Sacramento............................................................................ 12

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

# 1 Introducción:

El presente trabajo fue desarrollado por Sofia Rodriguez, Sol Mendez, Agustin Muñoz, Lucas Aguiar, Matias Otte, estudiantes de **3.er año del Profesorado de Informática**, en el marco de la asignatura **Taller Integrador de Sistemas**, con el propósito de diseñar una propuesta tecnológica que responda a una necesidad o aporte valor a la comunidad.

Nuestro proyecto consiste en el desarrollo de un **mapa interactivo de Colonia del** **Sacramento** que permite a los usuarios descubrir distintos puntos de interés de la ciudad a través de la música. Mediante una plataforma digital, cada ubicación ofrece la posibilidad de reproducir contenido musical relacionado con el lugar, brindando una experiencia innovadora que combina tecnología, cultura y turismo.

Con esta propuesta buscamos promover el patrimonio cultural de Colonia, incentivar el turismo y demostrar cómo la informática puede utilizarse para crear soluciones creativas e interactivas que mejoran la experiencia de quienes visitan y disfrutan de la ciudad. Asimismo, este proyecto nos permitió integrar los conocimientos adquiridos durante nuestra formación, aplicando conceptos de análisis, diseño y desarrollo de sistemas a una situación real.

## 1.1. Propósito

El presente documento tiene como propósito especificar los requisitos funcionales y no funcionales del sistema **Ecos de Colonia**, una plataforma web interactiva diseñada para promover el conocimiento y la difusión del patrimonio histórico, cultural y musical de la ciudad de **Colonia del Sacramento**.

La plataforma permitirá a los usuarios explorar un mapa interactivo de la ciudad, donde cada punto de interés ofrecerá información relevante sobre su historia, características patrimoniales e importancia cultural. Además, cada ubicación estará asociada a una canción de autoría uruguaya, cuya selección buscará enriquecer la experiencia del usuario mediante una relación histórica, territorial, cultural o simbólica con el lugar representado.

Este documento servirá como guía durante las etapas de análisis, diseño, desarrollo, implementación y pruebas del sistema, estableciendo un marco común para todos los

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

integrantes del equipo de desarrollo y facilitando la validación de que el producto final cumpla con los objetivos definidos.

Asimismo, la especificación está dirigida al equipo de desarrollo, al docente responsable del Taller Integrador de Sistemas y a cualquier persona involucrada en la evaluación, mantenimiento o evolución futura de la plataforma.

## 1.2. Ámbito del Sistema

El sistema, denominado “Ecos de Colonia", consiste en una plataforma interactiva diseñada para que los usuarios puedan recorrer la ciudad de Colonia del Sacramento y descubrir distintos puntos de interés a través de la música. Mediante un mapa digital, el sistema permitirá acceder a información de cada ubicación y reproducir contenido musical asociado a cada sitio, ofreciendo una experiencia que combina turismo, cultura y tecnología. El sistema permitirá visualizar un mapa interactivo con marcadores de los diferentes lugares de interés, acceder a una breve descripción de cada punto y reproducir la música correspondiente. Además, facilitará la navegación por la ciudad y promoverá el conocimiento del patrimonio cultural mediante una interfaz sencilla e intuitiva. El sistema no tendrá como finalidad funcionar como una plataforma de reproducción musical en línea ni como una aplicación de navegación GPS. Tampoco permitirá que los usuarios suban contenido musical o modifiquen la información disponible, ya que los contenidos serán administrados por los responsables del sistema. Los principales objetivos del proyecto son promover el patrimonio histórico y cultural de Colonia del Sacramento, enriquecer la experiencia de turistas y residentes mediante el uso de tecnologías interactivas, incentivar el turismo cultural y demostrar la aplicación de herramientas informáticas en el desarrollo de soluciones innovadoras para la comunidad. Este documento forma parte de la Especificación de Requisitos de Software (ERS) elaborada para la asignatura Taller Integrador de Sistemas. Al tratarse de un proyecto académico, no existen documentos de nivel superior con los cuales mantener consistencia; por lo tanto, esta especificación constituye el documento principal de referencia para el análisis, diseño y desarrollo del sistema.

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

## 1.3. Definiciones, Acrónimos y Abreviaturas

|Nombre|Descripción|
|---|---|
|Usuario|Persona que utilizara el sistema|
|Sis-I|Sistema de información web interactivo para la difusión del patrimonio histórico,cultural y musical de Colonia del Sacramento.|
|ERS|Especificaciones de Requisitos software|
|RF|Requisitos Funcionales|
|RNF|Requisitos no funcionales|

## 1.4. Referencias

Título del documento Documento

Standard IEEE 830-1998 IEEE

# 2. Descripción General

Esta sección presenta el contexto general del sistema "Ecos de Colonia" y los factores que condicionan su desarrollo. Se describe el propósito del producto, su relación con otros sistemas, las funciones que ofrecerá, las características de sus usuarios, las restricciones del proyecto, las suposiciones adoptadas durante su elaboración y las posibles líneas de evolución futura. En conjunto, esta información brinda una visión general del sistema y sienta las bases para la definición de los requisitos que se detallan en la sección siguiente.

*2.1. Perspectiva del Producto*

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

"Ecos de Colonia" es un sistema independiente y autocontenido, desarrollado como proyecto académico en el marco de la asignatura Taller Integrador de Sistemas. No reemplaza ni se integra con sistemas institucionales existentes, sino que constituye un producto nuevo, concebido específicamente para este trabajo.

El sistema se concibe como una plataforma web que combina un mapa interactivo con la reproducción de contenido musical, apoyándose en servicios externos —como APIs de geolocalización para la visualización del mapa y plataformas de streaming musical para la reproducción de las canciones asociadas a cada punto de interés—. En este sentido, si bien el sistema es independiente en cuanto a su lógica y diseño, depende de estos servicios externos para el funcionamiento de algunas de sus funcionalidades clave.

*El sistema **Colonia Sonora** es una aplicación web independiente cuyo objetivo es ofrecer una* *experiencia interactiva para recorrer la ciudad de Colonia del Sacramento mediante un mapa digital* *con contenido musical asociado a distintos puntos de interés.*

*El sistema utilizará servicios externos para la visualización del mapa (por ejemplo, Google Maps u* *OpenStreetMap) y un reproductor de audio para la reproducción de las canciones. No forma parte de* *un sistema mayor, aunque podrá integrarse en el futuro con plataformas turísticas o culturales del* *departamento de Colonia.*

## 2.2. Funciones del Producto

El sistema ofrecerá las siguientes funciones principales:

Visualizar un mapa interactivo de Colonia del Sacramento. Mostrar los puntos de interés disponibles sobre el mapa. Permitir seleccionar un punto para acceder a su información. Reproducir la música asociada a cada ubicación. Mostrar una breve descripción del lugar seleccionado. Facilitar una navegación simple e intuitiva para todos los usuarios.

## 2.3. Características de los Usuarios

El sistema está dirigido principalmente a turistas, residentes y personas interesadas en conocer la ciudad desde una perspectiva cultural y musical.

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

Los usuarios no necesitan conocimientos técnicos para utilizar la aplicación, ya que contará con una interfaz amigable y de fácil uso. Se espera que los usuarios tengan conocimientos básicos sobre el uso de dispositivos móviles o computadoras y acceso a Internet.

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

## 2.4. Restricciones

El desarrollo del sistema estará sujeto a las siguientes restricciones:

- La aplicación requerirá conexión a Internet para acceder al mapa y reproducir el contenido musical.
- Se utilizarán tecnologías web compatibles con los navegadores actuales.
- El contenido musical deberá respetar los derechos de autor y las licencias correspondientes.
- El sistema dependerá del correcto funcionamiento de los servicios externos utilizados para los mapas y la reproducción del contenido.
- El proyecto será desarrollado dentro de los tiempos y recursos disponibles para la asignatura Taller Integrador de Sistemas.
(Pol ́ıticas de la empresa/Limitaciones del hardware/Interfaces con otras aplicaciones/Operaciones paralelas/Funciones de auditor ́ıa/Funciones de control/Lenguaje(s) de programacion/Protocolos de comunicaci ́on/Requisitos de habilidad/Criticalidad de la aplicaci ́on/Consideraciones acerca de la seguridad)

## 2.5. Suposiciones y Dependencias

Para el correcto funcionamiento del sistema se consideran las siguientes suposiciones:

- Los usuarios dispondrán de un dispositivo con acceso a Internet.
- Los servicios de mapas permanecerán disponibles durante el funcionamiento del sistema.
- La información y el contenido musical de cada punto de interés estarán previamente cargados y actualizados.
- Los navegadores utilizados serán compatibles con las tecnologías implementadas en la aplicación.
Si alguna de estas condiciones cambia, podrían ser necesarias modificaciones en los requisitos o en el funcionamiento del sistema.

## 2.6. Requisitos Futuros

Como posibles mejoras para futuras versiones del sistema se proponen las siguientes funcionalidades:

- Incorporar recorridos temáticos (históricos, culturales o gastronómicos).
- Agregar geolocalización para mostrar los puntos de interés cercanos al usuario.

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

- Permitir seleccionar diferentes géneros musicales o listas de reproducción.
- Incorporar soporte para varios idiomas.
# 3. Requisitos Específicos

## 3.1. Interfaces Externas

## 3.2. Funciones

## 3.3. Requisitos de Rendimiento

## 3.4. Restricciones de Diseño

## 3.5. Atributos del Sistema

## 3.6. Otros Requisitos

# 4. Apéndices

## Canciones sobre Colonia del Sacramento

## Colonia del Sacramento (2021)

## Autores: Sylvia Puentes de Oyenard y Amalia de la Vega

## Intérprete: Coro Municipal de Colonia

Historia La canción "Colonia del Sacramento" fue relanzada en el año 2021 como parte de las celebraciones por el 341.º aniversario de la fundación de la ciudad. Esta nueva versión reunió al Coro Municipal de Colonia junto a destacados músicos y solistas del departamento, con el propósito de rendir homenaje a una de las ciudades más importantes del patrimonio histórico uruguayo. La producción buscó revalorizar la identidad cultural coloniense y acercar la obra a las nuevas generaciones, resaltando el legado histórico y artístico de la ciudad. ¿Por qué la elegimos? Seleccionamos esta canción porque constituye uno de los homenajes musicales más recientes dedicados exclusivamente a Colonia del Sacramento. Además de destacar la belleza de la

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

ciudad, transmite el orgullo y el sentido de pertenencia de sus habitantes, convirtiéndose en una obra representativa de la identidad coloniense. Lugares representativos La canción puede asociarse principalmente con el Barrio Histórico, la Puerta de la Ciudadela, la Plaza Mayor y la Basílica del Santísimo Sacramento, lugares que simbolizan la historia y el origen de la ciudad.

## Chamarrita de Colonia

## Autores: María Elena Walsh y Oscar Alem

## Intérprete: María Elena Walsh

Historia Publicada entre 1976 y 1977 en el álbum *De Puño y Letra*, "Chamarrita de Colonia" es una de las obras musicales más reconocidas dedicadas a Colonia del Sacramento. En su letra, María Elena Walsh describe con sensibilidad y poesía algunos de los paisajes más característicos de la ciudad, como sus calles empedradas, las antiguas construcciones, el Río de la Plata y la combinación de las influencias portuguesas y españolas que forman parte de su identidad. Con el paso de los años, esta canción se convirtió en una referencia obligada para quienes desean conocer la esencia de Colonia a través de la música. ¿Por qué la elegimos? Elegimos esta canción porque representa uno de los homenajes artísticos más importantes realizados a la ciudad. Su letra permite recorrer imaginariamente Colonia del Sacramento y comprender el valor histórico y cultural que posee este sitio declarado Patrimonio Mundial por la UNESCO. Lugares representativos La canción evoca lugares como la Calle de los Suspiros, la Plaza Mayor, la Basílica del Santísimo Sacramento, el Barrio Histórico y la costa del Río de la Plata, espacios que aparecen reflejados en su descripción poética.

## Chamarrita de Colonia (Versión Aymama)

## Autores: María Elena Walsh y Oscar Alem

## Intérprete: Aymama

Historia

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

En el año 2010 el grupo vocal femenino Aymama grabó una nueva versión de esta tradicional chamarrita. La interpretación conserva la esencia de la composición original, incorporando arreglos vocales contemporáneos que permiten acercar la obra a un público más joven. Gracias a esta versión, la canción volvió a difundirse y reafirmó su importancia dentro del repertorio dedicado a Colonia del Sacramento. ¿Por qué la elegimos? La seleccionamos porque demuestra que las obras clásicas pueden mantenerse vigentes y seguir emocionando a distintas generaciones. Esta versión mantiene viva una de las canciones más representativas sobre Colonia. Lugares representativos La obra continúa representando al Barrio Histórico, especialmente sus calles de piedra, las antiguas viviendas y los espacios tradicionales que caracterizan a la ciudad.

## Colonia del Sacramento

## Autor e intérprete: Raúl Montero

Historia Incluida en el álbum *Canción de Plata* (2006), esta obra fue compuesta como un homenaje a Colonia del Sacramento. A través de su letra transmite la tranquilidad, la belleza natural y el valor histórico de la ciudad, resaltando la armonía entre el patrimonio arquitectónico y el paisaje costero del Río de la Plata. La canción expresa el afecto y la admiración que muchos uruguayos sienten por este lugar. ¿Por qué la elegimos? Elegimos esta obra porque refleja la serenidad y el encanto de Colonia desde la mirada de un artista uruguayo. Es una canción que invita a valorar la ciudad como un espacio de historia, cultura y encuentro. Lugares representativos Se relaciona con la Rambla Costanera, el Puerto de Colonia, el Río de la Plata y el Barrio Histórico, lugares que forman parte de la identidad de la ciudad.

## Colonia... desde el alma

## Producción: Alfredo Villagrán

Historia

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

Publicado en 2004, "Colonia... desde el alma" es un disco homenaje que reúne once composiciones inspiradas en la historia, los paisajes y la cultura de Colonia del Sacramento. En el proyecto participaron el Coro Municipal de Colonia y reconocidos artistas del departamento como Alejandro Germán, Néstor Velázquez, Chony Conrado, Eugenio Visca, Luis Carro, Fernando Cardani y Alfredo Villagrán. El objetivo principal fue preservar la memoria musical de la ciudad y promover el talento artístico local. ¿Por qué la elegimos? La elegimos porque constituye uno de los proyectos musicales más importantes dedicados íntegramente a Colonia del Sacramento. Además de reunir a destacados músicos locales, refleja el compromiso por mantener viva la identidad cultural del departamento. Lugares representativos El disco hace referencia a distintos espacios de la ciudad, entre ellos el Barrio Histórico, la Plaza Mayor, el Puerto, la Rambla Costanera y el Río de la Plata.

## Artistas de Colonia del Sacramento

## Luana Persíncula (Luana)

Historia Luana Persíncula nació en Colonia del Sacramento y comenzó su carrera artística desde muy pequeña. Gracias a su talento y carisma logró convertirse en una de las cantantes de música tropical más reconocidas del Uruguay. Conocida como "La Princesita de la Plena", ha obtenido discos de Oro y Platino y ha realizado presentaciones tanto en Uruguay como en otros países. Su trayectoria demuestra que desde Colonia pueden surgir artistas con proyección nacional e internacional. ¿Por qué la elegimos? La elegimos porque es una de las artistas colonienses más exitosas y reconocidas de la actualidad, siendo un ejemplo de dedicación y crecimiento profesional para las nuevas generaciones.

## José Grucci

Historia

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

José Grucci es músico, compositor y productor coloniense. Además de desarrollar una importante carrera artística, fundó el Centro de Artes y Música (CAM), institución dedicada a la formación de nuevos músicos y al desarrollo de actividades culturales en Colonia del Sacramento. Su trabajo ha sido fundamental para impulsar la educación musical y fomentar el talento local. ¿Por qué lo elegimos? Lo seleccionamos por su gran aporte a la cultura coloniense, no solo como músico sino también como formador de nuevas generaciones de artistas.

## Mauro Carrecelas

Historia Mauro Carrecelas es un cantautor dedicado a la música popular uruguaya. A lo largo de su carrera ha participado en festivales, peñas y eventos culturales del departamento de Colonia, interpretando composiciones propias y canciones tradicionales que mantienen vivas las raíces musicales del país. ¿Por qué lo elegimos? Porque representa la música popular uruguaya y el compromiso de los artistas locales con la preservación de las tradiciones culturales.

## La Llave

Historia La Llave es una banda de música tropical formada en Colonia del Sacramento. Con varios años de trayectoria, participa habitualmente en bailes populares, festivales y celebraciones tanto en el departamento como en otras zonas del Uruguay, convirtiéndose en un referente de la música tropical coloniense. ¿Por qué la elegimos? Porque representa uno de los géneros musicales más populares del país y demuestra el crecimiento de las bandas locales dentro de la escena tropical.

## Chelo Duarte

Historia

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

Chelo Duarte es un cantautor coloniense vinculado al folclore y la música popular uruguaya. Ha participado en festivales regionales y encuentros culturales, difundiendo tanto composiciones propias como obras tradicionales del repertorio nacional. ¿Por qué lo elegimos? Porque mantiene viva la tradición folclórica del departamento y contribuye a preservar el patrimonio musical uruguayo.

## Agustina Torres

Historia Agustina Torres pertenece a la nueva generación de artistas de Colonia del Sacramento. Su carrera se desarrolla dentro de la música urbana, interpretando géneros como rap, trap y reguetón, utilizando principalmente plataformas digitales para difundir su trabajo. ¿Por qué la elegimos? Porque representa la evolución de la música coloniense y demuestra cómo los nuevos estilos también forman parte de la identidad cultural del departamento.

## Federico Garat

Historia Federico Garat es un cantautor de pop y rock que participa en distintos proyectos musicales dentro del departamento de Colonia. Sus presentaciones incluyen espectáculos como solista y colaboraciones con otras bandas locales. ¿Por qué lo elegimos? Porque representa el desarrollo del pop y el rock dentro de la escena musical coloniense.

## Alfredo Villagrán

Historia Alfredo Villagrán es uno de los referentes culturales más importantes de Colonia del Sacramento. Además de su actividad como músico y cantautor, ha trabajado en teatro, cine y producción artística. Ha impulsado numerosos proyectos relacionados con la preservación de la identidad cultural de la ciudad, destacándose la producción del disco "Colonia... desde el alma". ¿Por qué lo elegimos?

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

Porque su trabajo ha sido fundamental para conservar y difundir el patrimonio musical y cultural del departamento.

## Videoclips grabados en Colonia del Sacramento

## Soledad Pastorutti – "El Bahiano"

Historia El videoclip de "El Bahiano" fue grabado a fines de la década de 1990 en el Barrio Histórico de Colonia del Sacramento, uno de los sitios patrimoniales más importantes del Uruguay. La producción aprovechó la arquitectura colonial, las calles empedradas y el entorno característico de la ciudad para acompañar la estética de la canción. Años después, Soledad Pastorutti recordó con cariño la experiencia de haber filmado en Colonia, destacando la belleza y el encanto del lugar. ¿Por qué lo elegimos? Elegimos este videoclip porque fue una de las primeras producciones musicales de gran repercusión nacional e internacional filmadas en Colonia del Sacramento. Además, permitió mostrar el patrimonio histórico de la ciudad a miles de personas y contribuyó a posicionarla como un escenario atractivo para futuras producciones audiovisuales. Lugar de filmación Barrio Histórico Calle de los Suspiros Plaza Mayor Calles coloniales del casco histórico

## Los Fabulosos Cadillacs – "Sopa de Caracol"

Historia Parte del videoclip de "Sopa de Caracol" fue filmado en Playa Real de San Carlos, aprovechando el paisaje costero y el ambiente veraniego de Colonia del Sacramento. La elección de este lugar permitió mostrar una faceta diferente de la ciudad, destacando sus playas y espacios naturales además de su reconocido patrimonio histórico. ¿Por qué lo elegimos?

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

Seleccionamos este videoclip porque demuestra que Colonia no solo es conocida por su Barrio Histórico, sino también por sus playas y paisajes naturales. La producción ayudó a difundir otra imagen de la ciudad y a destacar la diversidad de sus atractivos turísticos. Lugar de filmación Playa Real de San Carlos Costa de Colonia del Sacramento

## Sandra Costabel & Héctor Bacci – "Botijas" (2024)

Historia El videoclip de "Botijas", estrenado en 2024, fue filmado íntegramente en Colonia del Sacramento. Durante el recorrido pueden observarse algunos de los lugares más representativos de la ciudad, integrando el patrimonio histórico con los paisajes costeros. La producción busca transmitir la identidad coloniense y poner en valor la riqueza cultural y turística del departamento. ¿Por qué lo elegimos? Elegimos esta producción porque es una de las más recientes grabadas en Colonia y porque promociona los principales atractivos de la ciudad a través de la música. Además, refleja el compromiso de artistas uruguayos por difundir el patrimonio nacional. Lugar de filmación Barrio Histórico Rambla Costanera Puerto de Colonia Plaza Mayor Calles del centro histórico

## Matías Ferreira – "Renacer"

Historia El videoclip de "Renacer" fue rodado entre Buenos Aires y Colonia del Sacramento. Para las escenas grabadas en Uruguay se eligieron diversos rincones del Barrio Histórico, aprovechando su arquitectura colonial, sus calles de piedra y el ambiente tranquilo que caracteriza a la ciudad. Estos escenarios acompañan el mensaje de renovación y esperanza que transmite la canción.

**Proyecto: Sistema de información web** **interactivo para la difusión del patrimonio histórico,** **cultural y musical de Colonia del Sacramento.**

¿Por qué lo elegimos? Lo seleccionamos porque utiliza algunos de los espacios más emblemáticos de Colonia para contar una historia, mostrando la ciudad como un escenario con un gran valor histórico, cultural y visual.

Lugar de filmación Barrio Histórico Centro de Colonia Calles empedradas Espacios patrimoniales

## Márama – "Ya No Llora" (2021)

Historia El videoclip de "Ya No Llora" fue grabado en 2021 durante el regreso oficial de Márama. La producción se realizó principalmente en el Sheraton Colonia Golf & Spa Resort y en sus alrededores. Aunque la filmación tuvo lugar en pleno invierno, mediante la ambientación y la producción audiovisual se recreó un clima veraniego. El videoclip marcó además el esperado regreso de una de las bandas uruguayas más populares de los últimos años. ¿Por qué lo elegimos? Elegimos este videoclip porque muestra una imagen moderna y diferente de Colonia del Sacramento. Además de promocionar uno de los hoteles más importantes del departamento, permitió que millones de personas conocieran parte de los paisajes de la ciudad a través de una producción musical de gran difusión. Lugar de filmación Sheraton Colonia Golf & Spa Resort Costa de Colonia Áreas verdes cercanas al hotel Espacios abiertos del complejo turístico