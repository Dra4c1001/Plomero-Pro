import { PlumbingRecord, DiagnosticData } from '../types/database';

// Technical templates and building blocks for procedural enrichment
interface SubcategoryPattern {
  subcategoria: string;
  problemas: string[];
  causas: string[][];
  materiales: string[][];
  pasos: string[][];
  checklists: string[][];
  basePrice: number;
  priceVar: number;
  timeMin: number;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | 'Especialista';
}

const MODULE_1_PATTERNS: SubcategoryPattern[] = [
  {
    subcategoria: 'Inodoros y Sanitarios',
    problemas: [
      'Instalación de inodoro two-piece con brida flexible y sellador antibacteriano',
      'Instalación de inodoro one-piece de alta eficiencia con descarga doble de 4.8L',
      'Instalación de inodoro suspendido de pared con bastidor empotrado y pulsador dual',
      'Reparación de fuga continua en taza de inodoro por sapito/flapper desgastado',
      'Reemplazo de válvula de llenado antisifón hidrostática con filtro de impurezas',
      'Sustitución de empaque cónico entre estanque y taza con pernos de latón niquelado',
      'Instalación de fluxómetro de palanca para inodoro institucional en tubería de 1-1/4"',
      'Mantenimiento de fluxómetro de pedal con cambio de diafragma de neopreno y émbolo',
      'Instalación de asiento sanitario con sistema de cierre suave y fijación rápida',
      'Corrección de balanceo de inodoro con acuñado plástico rígido y sellado de silicona neutra',
      'Instalación de bidet cerámico con grifería monomando y válvula pop-up de 1-1/4"',
      'Conversión de inodoro convencional a sistema ecológico dual-flush 3L / 6L',
      'Desmontaje de sanitario agrietado y saneamiento de boca de desagüe cloacal de 4"',
      'Instalación de urinario mural con trampa integrada y fluxómetro sensor electrónico',
      'Sustitución de brida de PVC rota en boca de desagüe sanitario con brida de reparación metálica',
      'Reemplazo de manguera flexible de alimentación de 1/2" x 7/8" en acero trenzado'
    ],
    causas: [
      ['Desgaste natural de sello de elastómero por ataque de pastillas cloradas', 'Sedimentación calcárea en el labio de sellado'],
      ['Pernos de fijación oxidados y tuercas barridas por corrosión galvánica', 'Empaque esponjoso degradado'],
      ['Presión de red excesiva (>60 PSI) que deforma el diafragma de llenado', 'Filtro de entrada tupido con arenilla'],
      ['Piso a desnivel con falta de apoyo perimetral', 'Falla de mortero de asiento antiguo sin brida mecánica'],
      ['Rotura de sello de cera por holgura y movimiento repetido del inodoro', 'Tornillos de anclaje flojos']
    ],
    materiales: [
      ['Inodoro completo', 'Brida sanitaria flexible 4"', 'Cuello de cera con guía plástica', 'Llave de escuadra 1/2"', 'Flexible mallado inox 1/2" x 7/8"', 'Pernos de anclaje de bronce 5/16"'],
      ['Válvula de llenado antisifón ajustable', 'Flapper de silicona 2"', 'Cadena de acero inoxidable', 'Cinta teflón teflonada 3/4" PTFE de alta densidad'],
      ['Kit de diafragma para fluxómetro', 'Llave inglesa para fluxómetro', 'Grasa siliconada dieléctrica', 'Válvula de retención'],
      ['Bastidor de montaje empotrado', 'Manguito de desagüe 90/110mm', 'Aislante acústico de espuma', 'Varillas roscadas M12'],
      ['Junta de estanque a taza', 'Juego de pernos pasantes con arandelas de goma cónica', 'Sellador de silicona acética antihongo']
    ],
    pasos: [
      [
        'Cerrar la llave de escuadra y vaciar totalmente el estanque de agua.',
        'Retirar los pernos viejos y limpiar la base de la losa retirando residuos de cera y silicón.',
        'Colocar la nueva brida de acople mecánico asegurada con taquetes y tornillos de acero inoxidable.',
        'Fijar el sello de cera con anillo plástico en la boca de descarga del inodoro.',
        'Posicionar el inodoro aplicando presión vertical uniforme para asentar la junta de cera.',
        'Ajustar pernos de anclaje alternadamente con arandelas plásticas sin apretar en exceso.',
        'Conectar manguera flexible, abrir paso de agua y verificar estanqueidad al 100%.'
      ],
      [
        'Cortar el suministro de agua hacia el artefacto y drenar el tanque accionando la maneta.',
        'Desacoplar la manguera flexible inferior y desenroscar la tuerca plástica de fijación de la válvula.',
        'Limpiar el orificio interior del estanque y retirar el sarro acumulado.',
        'Insertar la nueva válvula de llenado regulando la altura del vástago a 2.5 cm sobre el rebose.',
        'Apretar la tuerca inferior con llave ajustable cuidando de no deformar la goma de sello.',
        'Alinear el tubo de recarga hacia el tubo de sobreflujo del tanque.',
        'Reconectar flexible, llenar estanque y calibrar el tornillo del flotador al nivel marcado.'
      ]
    ],
    checklists: [
      [
        'Verificación de corte hermético de válvula de llenado al nivel de espejo de agua fijado.',
        'Inspección con servilleta seca alrededor de la base del piso durante 3 descargas continuas.',
        'Comprobación de ausencia de movimiento o balanceo sobre la baldosa.',
        'Alineación y tensión correcta de la cadenilla sin trabarse con la palanca.',
        'Sellado perimetral con cordón fino de silicona dejando 2 cm abiertos en la parte trasera para testigo de fugas.'
      ],
      [
        'Tiempo de recarga del estanque inferior a 65 segundos a presión de trabajo.',
        'Nivel de agua a exactamente 20mm por debajo del borde superior del tubo de rebose.',
        'Descarga completa de sifonamiento sin residuos en el fondo de la taza.',
        'Llave de escuadra libre de goteo en el vástago y en la rosca macho.'
      ]
    ],
    basePrice: 55,
    priceVar: 140,
    timeMin: 60,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Griferías de Cocina y Baño',
    problemas: [
      'Instalación de grifería monomando de cocina con caño extraíble y pulverizador dual',
      'Sustitución de grifería bimando de lavabo por monomando ecológico con cartucho cerámico',
      'Reparación de goteo continuo en grifo por cartucho cerámico de 35mm fisurado',
      'Instalación de grifería mural empotrada para lavamanos con cuerpo de latón bajo revoque',
      'Instalación de grifería automática con sensor infrarrojo a pilas/red para baño comercial',
      'Reemplazo de latiguillos/flexibles de grifería con malla de acero inoxidable AISI 304',
      'Mantenimiento y descalcificación de aireador/atomizador antical con reducción de caudal',
      'Instalación de grifo monomando de caño alto abatible especial para ventana de cocina',
      'Sustitución de vástago de compresión y empaque de zapata en llave bimando antigua',
      'Corrección de holgura y juego mecánico en la base de grifo monomando sobre encimera',
      'Instalación de grifo dispensador de agua filtrada de 1 vía con conexión rápida 1/4"',
      'Reparación de pérdida de agua por el selector de ducha en batería de baño',
      'Instalación de grifo temporizado de pulsador antivandálico para uso institucional',
      'Sustitución de caño giratorio de fregadero por desgaste en juntas tóricas internas',
      'Instalación de válvula mezcladora monomando empotrada para ducha con inversor cerámico'
    ],
    causas: [
      ['Desgaste y rayaduras en discos cerámicos interiores por partículas de cal y arena', 'Pérdida de elasticidad en junta tórica perimetral'],
      ['Fatiga en manguera flexible por torsión durante el montaje original o corrosión de malla exterior', 'Envejecimiento de caucho EPDM'],
      ['Fijación floja de la herradura de sujeción inferior por contracción de la madera de la mesada'],
      ['Acumulación extrema de carbonato de calcio (sarro) en las rejillas del difusor', 'Reducción severa de caudal']
    ],
    materiales: [
      ['Grifería monomando', 'Juego de mangueras flexibles inox 1/2" x M10 de 50cm', 'Herradura de fijación con perno y tuerca', 'Llave para tuercas de grifo', 'Cinta PTFE'],
      ['Cartucho cerámico 35mm/40mm', 'Llave allen 2.5mm', 'Llave pico de loro', 'Grasa atóxica para grifería'],
      ['Grifería temporizada 1/2"', 'Filtro en línea de 100 micras', 'Teflón líquido', 'Llave fija 22mm'],
      ['Cuerpo empotrable de latón', 'Tacos expansivos', 'Nivel de burbuja', 'Tapones de prueba de 1/2"']
    ],
    pasos: [
      [
        'Cerrar llaves de escuadra de agua fría y caliente ubicadas bajo la bacha.',
        'Desconectar los flexibles antiguos y retirar la tuerca de fijación inferior con llave tubular de lavabo.',
        'Extraer el grifo viejo y limpiar a fondo la superficie de la encimera.',
        'Insertar la junta de estanqueidad tórica en la ranura de la base del grifo nuevo.',
        'Pasar los flexibles y el vástago roscado por el orificio de montaje del mueble/mesada.',
        'Colocar la junta de goma inferior, la arandela metálica de media luna y apretar firmemente la tuerca.',
        'Conectar los flexibles a las llaves de escuadra verificando agua caliente a la izquierda y fría a la derecha.'
      ],
      [
        'Cortar el suministro de agua y abrir el monomando para despresurizar el circuito.',
        'Retirar la tapita embellecedora con aguja o destornillador fino y aflojar el prisionero allen.',
        'Tirar de la maneta hacia arriba para desacoplarla del vástago.',
        'Desenroscar el cúpula embellecedora y la tuerca de latón que prensa el cartucho.',
        'Extraer el cartucho deteriorado y limpiar la cavidad interna del cuerpo de latón.',
        'Instalar el cartucho nuevo alineando las dos pestañas guía en sus respectivos alojamientos.',
        'Apretar la tuerca de presión a un par de 10-12 Nm para no fracturar la cerámica y montar maneta.'
      ]
    ],
    checklists: [
      [
        'Ausencia de goteo en cartucho a presión estática máxima de 4 bar.',
        'Verificación de temperatura correcta: izquierda caliente (rojo) y derecha fría (azul).',
        'Estanqueidad absoluta en empalmes de flexibles de 1/2" tras 15 minutos presurizado.',
        'Chorro homogéneo sin salpicaduras y caño con giro suave de 360° sin rozamiento.',
        'Firmeza absoluta de fijación sin torsión del grifo al operar la maneta con fuerza.'
      ]
    ],
    basePrice: 40,
    priceVar: 110,
    timeMin: 45,
    difficulty: 'Básico'
  },
  {
    subcategoria: 'Duchas, Regaderas y Bañeras',
    problemas: [
      'Instalación de válvula mezcladora termostática empotrada con selector de 2 salidas',
      'Instalación de columna de ducha hidromasaje con jets dorsales y rociador superior XXL',
      'Sustitución de inversor de ducha defectuoso con fuga continua simultánea en caño y regadera',
      'Reemplazo de rociador de ducha antical de 25cm con brazo mural de latón cromado',
      'Instalación de plato de ducha de resina con desagüe sifónico extraplano de 90mm',
      'Sellado y calafateo perimetral de plato de ducha con silicona fungicida de alta adherencia',
      'Reparación de fuga oculta en codo de conexión hembra de 1/2" tras azulejo de ducha',
      'Instalación de flexo de ducha antitorsión de doble engrapado y mango multifunción',
      'Instalación de mampara corrediza de cristal templado de 8mm sobre plato de ducha',
      'Sustitución de cartucho termostático bloqueado por sedimentos de magnesio y cal',
      'Instalación de desagüe lineal ranurado en ducha de obra con tela impermeabilizante',
      'Sustitución de caño de llenado de bañera con aireador de cascada y desviador'
    ],
    causas: [
      ['Rotura del elemento termovariable de cera por golpe térmico o exceso de temperatura (>75°C)', 'Tupición de filtros perimetrales'],
      ['Pérdida de elasticidad del resorte del desviador y desgaste de empaques tóricos internos'],
      ['Envejecimiento y agrietamiento de la masilla de silicona por detergentes abrasivos y humedad continua', 'Formación de moho negro'],
      ['Falta de alineación y nivelación en las tomas excéntricas de latón de 1/2" a 3/4"']
    ],
    materiales: [
      ['Mezcladora termostática', 'Excéntricas 1/2" a 3/4"', 'Juntas con filtro de malla de acero', 'Embellecedores cónicos', 'Nivel de mano'],
      ['Cartucho termostático de recambio', 'Llave allen', 'Llave dinamométrica', 'Desincrustante cítrico atóxico'],
      ['Silicona neutra fungicida antimoho', 'Cinta de carrocero / enmascarar', 'Alcohol isopropílico', 'Pistola de calafatear ergonómica'],
      ['Plato de ducha resina/mineral', 'Válvula sifónica 90mm', 'Tubo PVC flexible 40mm', 'Adhesivo de polímero MS']
    ],
    pasos: [
      [
        'Cerrar el paso general de agua caliente y fría del cuarto de baño.',
        'Comprobar la distancia entre tomas (150 mm ± 15 mm) con calibre o metro.',
        'Aplicar cinta teflón en las roscas macho de las excéntricas y roscarlas a los codos de pared.',
        'Nivelar horizontalmente las excéntricas y verificar distancia exacta entre centros.',
        'Colocar los plafones embellecedores roscados hasta la pared azulejada.',
        'Insertar las juntas con filtro de acero inoxidable en las tuercas locas de 3/4" de la grifería.',
        'Apretar las tuercas uniformemente intercalando vueltas con llave protegida con cinta para no dañar el cromo.'
      ]
    ],
    checklists: [
      [
        'Corte automático de seguridad por fallo de agua fría (< 2 segundos) para evitar quemaduras.',
        'Temperatura constante regulada a 38°C en posición de tope de seguridad.',
        'Presión equilibrada entre ambas entradas sin retorno de agua caliente hacia fría.',
        'Cero filtración en roscas excéntricas con prueba de presión de 15 minutos.'
      ]
    ],
    basePrice: 60,
    priceVar: 180,
    timeMin: 75,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Fregaderos, Piletas y Lavamanos',
    problemas: [
      'Instalación de fregadero de cocina bajo encimera de cuarzo con grapas de anclaje epóxicas',
      'Instalación de fregadero de doble cubeta en acero inoxidable sobre mesada de granito',
      'Instalación de triturador de desperdicios orgánicos de 3/4 HP con pulsador neumático',
      'Sustitución de válvula de canasta/desagüe de 3-1/2" con rebosadero flexible en fregadero',
      'Instalación de sistema de filtración de agua bajo encimera por ósmosis inversa de 5 etapas',
      'Reparación de fuga en contra-canasta de fregadero por junta de goma resecada',
      'Instalación de sifón doble articulado con conexiones para lavavajillas y lavadora',
      'Montaje de lavabo sobre encimera tipo bowl con desagüe pop-up de latón sin rebose',
      'Desobstrucción y saneamiento de sifón botella en lavamanos con exceso de cabellos y grasa',
      'Sustitución de llave de paso de escuadra de 1/2" con filtro de retención en lavabo'
    ],
    causas: [
      ['Falla en la masilla o sellador bajo el borde de la canasta por envejecimiento mecánico', 'Tuerca de apriete inferior aflojada'],
      ['Vibración continuada del triturador que desacopla la brida Quick-Lock o el empalme de PVC'],
      ['Grasa y residuos alimenticios acumulados que atacan la masilla selladora original']
    ],
    materiales: [
      ['Válvula de canasta 3-1/2"', 'Junta de espuma de celdas cerradas', 'Junta de caucho esponjoso', 'Masilla de plomero / Sellador silicona neutra', 'Llave para contracanastas'],
      ['Triturador 3/4 HP', 'Interruptor de aire con tubo flexible de silicona', 'Codo de descarga con abrazadera', 'Cable con clavija tierra'],
      ['Sifón extensible de PVC blanco 1-1/2"', 'Empaques cónicos de polietileno', 'Tuercas moleteadas plásticas']
    ],
    pasos: [
      [
        'Desconectar el sifón existente y retirar la canasta vieja aflojando la gran tuerca inferior.',
        'Limpiar concienzudamente el orificio del fregadero por ambas caras con alcohol desengrasante.',
        'Colocar la junta de estanqueidad superior o cordón uniforme de masilla de fontanero.',
        'Insertar el cuerpo superior de la válvula centrado en el orificio.',
        'Por debajo de la bacha, colocar la junta de goma, la arandela de fricción de cartón y la tuerca metálica.',
        'Apretar enérgicamente con la llave de garras mientras se mantiene fija la canasta superior.',
        'Reconectar el sifón de descarga, llenar la bacha con 15 litros de agua y abrir el tapón para prueba de choque.'
      ]
    ],
    checklists: [
      [
        'Cero humedad en papel secante bajo la contracanasta con la pileta llena a máxima capacidad.',
        'Paso libre sin retención hacia el desagüe primario con flujo laminar.',
        'Toma auxiliar para manguera de lavavajillas sellada o fijada con abrazadera sinfín.'
      ]
    ],
    basePrice: 45,
    priceVar: 130,
    timeMin: 50,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Fugas y Redes de Distribución Interior',
    problemas: [
      'Reparación de fuga en tubería de polipropileno PPR termofusionada de 20mm/25mm en muro',
      'Sustitución de tramo corroído de tubería de cobre de 1/2" con uniones soldadas estaño-plata',
      'Reparación de fuga en tubería multicapa PEX-AL-PEX con accesorio prensado radial (press-fitting)',
      'Cambio de llave de paso general de esfera de 3/4" en acometida de vivienda con mando de palanca',
      'Reparación de fuga en junta de compresión en tubería de polietileno PEAD de 25mm',
      'Detección y reparación de fisura por helada/congelación en cañería de agua fría',
      'Sustitución de llaves de corte de escuadra antical con cuarto de vuelta en lavabos y sanitarios',
      'Eliminación de ruido por vibración en tubería empotrada mediante abrazaderas isofónicas con goma'
    ],
    causas: [
      ['Termofusión defectuosa por tiempo insuficiente o sobrecalentamiento que redujo la sección útil', 'Movimiento telúrico o dilatación térmica'],
      ['Corrosión por picadura (pitting) en cobre debido a aguas blandas ácidas o corrientes galvánicas', 'Soldadura fría con fundente no limpiado'],
      ['Apriete excesivo en racor de compresión que cortó la tubería de plástico']
    ],
    materiales: [
      ['Termofusora digital con dados de 20/25mm', 'Manguitos de unión PPR', 'Tijeras corta-tubos', 'Alcohol desengrasante'],
      ['Soplete de gas propano/MAPP', 'Hilo de soldar estaño-plata 95/5', 'Pasta decapante soluble', 'Cepillo desbarbador de cobre'],
      ['Prensa hidráulica manual con mordazas tipo TH/U', 'Manguito de reparación PEX', 'Calibrador escariador']
    ],
    pasos: [
      [
        'Cortar la llave de paso maestra y abrir los grifos inferiores para purgar toda el agua de la línea.',
        'Descubrir con cincel fino el tramo dañado asegurando 15 cm de margen libre para maniobra.',
        'Cortar limpiamente la sección averiada con cortatubos de cuchilla circular en ángulo recto.',
        'Biselar y limpiar la superficie exterior con paño impregnado en alcohol.',
        'Calentar simultáneamente el tubo y el accesorio en la termofusora a 260°C durante 5 a 7 segundos.',
        'Unir ambas piezas sin girarlas empujando firmemente hasta el tope de penetración.',
        'Mantener inmóvil durante el tiempo de fijación (4 a 6 segundos) y dejar enfriar antes de presurizar.'
      ]
    ],
    checklists: [
      [
        'Prueba hidrostática a 1.5 veces la presión nominal de trabajo durante mínimo 30 minutos sin caída de presión.',
        'Alineación perfecta del eje de la tubería sin tensiones de palanca.',
        'Protección de la tubería con coquilla o manga aislante antes de tapar la roza con mortero.'
      ]
    ],
    basePrice: 65,
    priceVar: 160,
    timeMin: 90,
    difficulty: 'Avanzado'
  }
];

const MODULE_2_PATTERNS: SubcategoryPattern[] = [
  {
    subcategoria: 'Tanques Elevados y Cisternas',
    problemas: [
      'Instalación de tanque elevado de polietileno tricapa antimicrobiano de 1100 Litros',
      'Sustitución de válvula de llenado mecánica de flotador de bronce de 3/4" con varilla regulable',
      'Instalación de interruptor de nivel eléctrico (boya hermética) con contrapeso para control de bomba',
      'Limpieza, desinfección química con cloro y retiro de lodos de cisterna subterránea de 5000L',
      'Reparación de filtración en boquilla de descarga de tanque plástico con junta elastomérica',
      'Instalación de tubería de rebose y venteo de 2" con malla de acero inoxidable anti-insectos',
      'Automatización de trasvase entre cisterna baja y tanque elevado mediante relay de alternancia',
      'Instalación de filtro de sedimentos lavable de 50 micras en la entrada principal del estanque',
      'Sustitución de llave de paso de salida de tanque tipo compuerta por válvula de esfera de 1-1/2"',
      'Reparación de fisura en pared de tanque de polietileno mediante termofusión plástica con aporte de PE'
    ],
    causas: [
      ['Descalibración o perforación de la boya de flotador con entrada de agua en su interior', 'Asiento de válvula picado por arenilla'],
      ['Acumulación de limo, bacterias y biopelícula por falta de mantenimiento semestral reglamentario', 'Sellado deficiente de la tapa de inspección'],
      ['Falla del microinterruptor interno del flotador por condensación o fatiga de cable sumergido'],
      ['Tensión mecánica en la tubería de bajante sin juntas de dilatación que rajan el fondo del tanque']
    ],
    materiales: [
      ['Tanque 1100L tricapa', 'Flotador mecánico de bronce 3/4"', 'Boya de polietileno de alta resistencia', 'Conexión de tanque multiconector 1-1/2"', 'Válvula de esfera de PVC cédula 80'],
      ['Interruptor de nivel sumergible con cable neopreno de 3 metros', 'Contrapeso regulable', 'Tubo conduit para protección eléctrica'],
      ['Hipoclorito de sodio al 5%', 'Bomba de achique portátil', 'Hidrolavadora de 1500 PSI', 'Cepillos de cerda plástica rígida'],
      ['Filtro de agua de entrada jumbo de 20"', 'Cartucho lavable de malla inoxidable', 'Llave de apertura de vaso']
    ],
    pasos: [
      [
        'Cerrar la entrada de agua de la red y vaciar el estanque por la válvula de desagüe de fondo.',
        'Inspeccionar la base de apoyo: debe ser plana, lisa y sobresalir 10 cm del diámetro del tanque.',
        'Instalar el racor multiconector de salida en el orificio inferior utilizando las juntas de EPDM sin teflón.',
        'Apretar la tuerca de apriete desde el interior con llave específica para racores de tanque.',
        'Montar la válvula de flotador de 3/4" en la parte superior verificando que la varilla no roce la pared.',
        'Instalar la tubería de rebosadero de 2" con caída hacia drenaje visible para alerta temprana.',
        'Llenar el depósito, comprobar flotabilidad de boya y verificar ausencia total de goteo en conectores.'
      ]
    ],
    checklists: [
      [
        'Corte automático de agua cuando el nivel se encuentra 5 cm por debajo de la boca de rebose.',
        'Conexión eléctrica de flotador con puesta a tierra y protección magnetotérmica adecuada.',
        'Tapa roscada perfectamente sellada impidiendo ingreso de polvo, luz solar o insectos.',
        'Válvula de aireación/respiro con malla mosquitera de acero inoxidable intacta.'
      ]
    ],
    basePrice: 70,
    priceVar: 220,
    timeMin: 120,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Bombas Centrífugas y Sumergibles',
    problemas: [
      'Instalación de bomba sumergible para pozo profundo de 1.5 HP con camisa de enfriamiento',
      'Instalación de bomba de achique para fosa de aguas pluviales con flotador vertical integrado',
      'Instalación de bomba trituradora para aguas residuales cloacales con impulsor vortex de alta resistencia',
      'Sustitución de sello mecánico de carburo de silicio y rodamientos sellados en bomba centrífuga',
      'Instalación de válvula de retención vertical silenciosa tipo check de resorte en línea de impulsión',
      'Cebado y purga de aire en cuerpo de bomba centrífuga por entrada de burbujas en tubería de succión',
      'Reemplazo de condensador de arranque desvalorizado en motor monofásico de bomba periférica',
      'Instalación de cuadro eléctrico de mando con disyuntor guardamotor térmico y relé de nivel de pozo',
      'Corrección de vibración excesiva y desalineación en acople de electrobomba con bancada de hormigón',
      'Sustitución de tubería de succión rígida aplastada por manguera reforzada con espiral de alambre'
    ],
    causas: [
      ['Cavidades de aire en la tubería de succión por falta de válvula de pie con canastilla o fuga en unión roscada', 'Pérdida de cebado'],
      ['Bloqueo del impulsor por fibras textiles o sólidos no triturables en fosas sanitarias'],
      ['Funcionamiento en seco por agotamiento temporal del caudal del pozo sin protección de electrodos'],
      ['Desgaste de caras rozantes del sello mecánico por paso de agua arenosa']
    ],
    materiales: [
      ['Bomba sumergible 1.5 HP', 'Cable sumergible plano 4x2.5mm con empalme vulcanizado termorretráctil', 'Cuerda de seguridad de acero inox con forro plástico', 'Válvula check de retención vertical'],
      ['Sello mecánico 16mm/20mm', 'Juego de rodamientos SKF 6203/6204', 'Extractor de poleas y rodamientos', 'Aceite dieléctrico grado alimentario'],
      ['Tablero eléctrico estanco IP65', 'Guardamotor regulable de 6-10A', 'Sondas de nivel de acero inoxidable'],
      ['Válvula de pie de bronce con filtro de canasta inoxidable de 1-1/4"']
    ],
    pasos: [
      [
        'Verificar el diámetro y profundidad del pozo, así como la altura del nivel freático dinámico.',
        'Realizar el empalme estanco del cable del motor utilizando kit de resina epoxi o funda vulcanizada.',
        'Enroscar la tubería de impulsión de polietileno de alta densidad PE100 con racores de latón.',
        'Fijar la cuerda de sujeción de seguridad de acero inoxidable a los cáncamos de la bomba.',
        'Bajar lentamente la bomba al pozo asegurando el cable eléctrico con abrazaderas cada 3 metros.',
        'Instalar válvula check a la salida de la bomba y en la boca del pozo.',
        'Conectar al tablero de control, medir consumo de amperaje y comprobar sentido de rotación.'
      ]
    ],
    checklists: [
      [
        'Consumo de corriente nominal en amperios dentro de la placa técnica del motor.',
        'Ausencia de golpe de ariete al desconectar la bomba gracias a la válvula de retención.',
        'Aislamiento dieléctrico de devanados superior a 20 Megaohmios con megóhmetro a 500V.',
        'Caudal continuo sin burbujas de aire tras 10 minutos de funcionamiento continuo.'
      ]
    ],
    basePrice: 95,
    priceVar: 350,
    timeMin: 150,
    difficulty: 'Avanzado'
  },
  {
    subcategoria: 'Presurizadores y Grupos Hidroneumáticos',
    problemas: [
      'Instalación de sistema hidroneumático con tanque de membrana intercambiable de 50L y bomba de 1 HP',
      'Calibración y regulación de presostato diferencial Square D (ajuste de presión de encendido 30 PSI y corte 50 PSI)',
      'Sustitución de membrana elastomérica rota en tanque hidroneumático de expansión',
      'Verificación y recarga de presión de precarga de aire/nitrógeno en tanque hidroneumático con manómetro',
      'Instalación de presurizador compacto inteligente con variador de frecuencia (VFD) para presión constante',
      'Sustitución de flujostato magnético de corte por flujo mínimo en bomba elevadora de presión',
      'Reparación de encendido y apagado constante (ciclado continuo o repiqueteo) en equipo presurizador',
      'Instalación de manómetro con baño de glicerina de 0-100 PSI en colector de impulsión de 1"',
      'Instalación de presurizador de rotor húmedo ultrasilencioso para departamento en línea de calentador',
      'Sustitución de conector flexible antivibratorio de 1" con codo de latón en grupo de presión'
    ],
    causas: [
      ['Pérdida total del aire de precarga por válvula de inflado (Schrader) con fuga en el obús central', 'Tanque saturado de agua'],
      ['Membrana de caucho EPDM pinchada o reventada por sobrepresión o fatiga de flexión', 'Salida de agua por la válvula de inflado'],
      ['Microfuga en llaves o inodoros de la casa que hace descender la presión de la red repetidamente'],
      ['Contactos platinados del presostato carbonizados por arco eléctrico reiterado']
    ],
    materiales: [
      ['Tanque hidroneumático 50L/100L', 'Presostato regulable 20/40 o 30/50 PSI', 'Manómetro de glicerina 0-6 bar', 'Manguera antivibrante mallada inox 1" macho-hembra', 'Racor de 5 vías de latón'],
      ['Membrana de recambio EPDM', 'Bomba de pie para inflado con manómetro de precisión', 'Obús de válvula de neumático'],
      ['Presurizador inverter electrónico', 'Transductor de presión 4-20mA', 'Filtro en Y de latón 1"']
    ],
    pasos: [
      [
        'Desconectar la alimentación eléctrica del grupo y aislar hidráulicamente cerrando válvulas.',
        'Abrir un grifo de la red para descargar por completo la presión remanente de agua.',
        'Medir con manómetro de presión de aire la precarga en la válvula superior del tanque.',
        'La presión de aire debe ajustarse a exactamente 2 PSI por debajo de la presión de encendido de la bomba.',
        'Si sale agua por la válvula de aire, desmontar la brida inferior y sustituir la membrana interna rota.',
        'Limpiar el interior de la carcasa metálica con trapo seco y montar la nueva membrana centrada.',
        'Apretar los pernos de la brida en cruz con par uniforme e inflar el tanque a la presión correcta de precarga.'
      ]
    ],
    checklists: [
      [
        'El equipo arranca suavemente al abrir un grifo y se apaga de forma limpia sin oscilaciones.',
        'Precarga de aire comprobada en seco con el tanque vacío de agua.',
        'Presión estática del manómetro se mantiene fija durante 30 minutos sin consumo en la vivienda.',
        'Uniones roscadas del racor de 5 vías selladas sin microburbujas con agua jabonosa.'
      ]
    ],
    basePrice: 65,
    priceVar: 190,
    timeMin: 75,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Aire en Tuberías y Golpe de Ariete',
    problemas: [
      'Instalación de supresor/amortiguador de golpe de ariete de pistón mecánico en toma de electroválvulas de lavadora',
      'Purga y desaireación de burbujas en línea matriz de agua potable con ruido sordo y vibración',
      'Instalación de válvula eliminadora automática de aire (ventosa hidráulica) en punto alto de la red',
      'Instalación de cámara de aire de amortiguación fabricada en cobre de 1" con tapón roscado',
      'Corrección de vibración resonante y silbido agudo en tuberías durante el llenado de sanitarios',
      'Sustitución de válvula ventosa de latón bloqueada por sedimentos de óxido y caliza',
      'Equilibrado y fijación de soportes antivibratorios en canalización suspendida sujeta a sobrepresiones'
    ],
    causas: [
      ['Cierre brusco e instantáneo de electroválvulas de lavado o monomandos cerámicos', 'Inercia del fluido a alta velocidad'],
      ['Puntos altos en el trazado de la tubería sin inclinación adecuada donde se acumulan bolsas de aire', 'Vaciado periódico de la red pública']
    ],
    materiales: [
      ['Amortiguador de golpe de ariete de acero inoxidable o latón con cámara de pistón de gas precargado', 'Tee de derivación de 3/4"', 'Teflón grado gas/hidráulico'],
      ['Válvula ventosa automática de purga de aire 1/2" o 3/4" en latón niquelado', 'Válvula de aislamiento de bola'],
      ['Abrazaderas isofónicas con perfil de goma vulcanizada antivibración', 'Tacos de nylon y varilla roscada']
    ],
    pasos: [
      [
        'Localizar el artefacto generador del pulso de impacto (generalmente lavadoras, lavavajillas o fluxómetros).',
        'Cortar el agua del sector e intercalar una conexión en T lo más cerca posible de la electroválvula.',
        'Instalar el amortiguador de pistón en posición vertical o ángulo no menor a 45° respecto a la horizontal.',
        'Asegurar la unión roscada con sellador anaeróbico o teflón de alta densidad.',
        'Fijar sólidamente la tubería anexa a la pared con abrazadera de goma para evitar transmisión de vibraciones.',
        'Reabrir el agua y activar el ciclo de llenado/corte de la máquina para comprobar la amortiguación del impacto.'
      ]
    ],
    checklists: [
      [
        'Desaparición del chasquido metálico o golpeteo en las paredes al cerrar súbitamente el paso de agua.',
        'Válvula ventosa expulsa el aire libremente y cierra de inmediato cuando el agua alcanza la boya interna.',
        'Presión hidrostática estabilizada sin picos transitorios superiores a 6 bar en manómetro de aguja arrastrada.'
      ]
    ],
    basePrice: 50,
    priceVar: 110,
    timeMin: 60,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Válvulas Reguladoras y Antirretorno',
    problemas: [
      'Instalación de válvula reductora de presión con diafragma y manómetro regulada a 3.5 bar (50 PSI)',
      'Limpieza y sustitución del cartucho de filtro de acero inoxidable de válvula reductora atascada',
      'Instalación de válvula de retención antirretorno con clapeta oscilante de bronce de 1-1/2"',
      'Instalación de válvula check de retención con resorte y disco de NBR silenciosa para alta presión',
      'Reemplazo de válvula reductora de presión averiada que genera sobrepresión nocturna en la vivienda',
      'Instalación de desconector hidráulico de reflujo para evitar contaminación cruzada de agua potable'
    ],
    causas: [
      ['Presión de red pública municipal excesiva (>80 PSI o 6 bar) que deteriora calderas y juntas de grifos', 'Picos de presión nocturnos'],
      ['Entrada de arenilla que raya el vástago y asiento de la reductora impidiendo el cierre a caudal cero']
    ],
    materiales: [
      ['Válvula reductora de presión con roscas macho desmontables', 'Manómetro de glicerina 0-10 bar', 'Filtro en Y previo', 'Llave de desmontaje'],
      ['Válvula de retención con cuerpo de latón estampado y clapeta de bronce', 'Teflón de alta densidad']
    ],
    pasos: [
      [
        'Cerrar la llave de acometida y drenar la línea abriendo un grifo de jardín o fregadero.',
        'Cortar el tramo de tubería después del contador general e intercalar un filtro de sedimentos y la reductora.',
        'Respetar el sentido de la flecha de flujo troquelada en el cuerpo de la válvula.',
        'Instalar un manómetro en la toma de salida de la reductora.',
        'Abrir el paso de agua y aflojar o apretar el tornillo de regulación superior hasta fijar la aguja en 3.5 bar.',
        'Cerrar todos los grifos y verificar que la presión estática no trepe tras 15 minutos.'
      ]
    ],
    checklists: [
      [
        'Presión constante en 3.5 bar con grifos cerrados (presión estática).',
        'Presión dinámica superior a 2.5 bar con dos grifos abiertos simultáneamente.',
        'Ausencia de ruidos de cavitación o silbido en el cuerpo de la reductora.'
      ]
    ],
    basePrice: 60,
    priceVar: 130,
    timeMin: 60,
    difficulty: 'Intermedio'
  }
];

const MODULE_3_PATTERNS: SubcategoryPattern[] = [
  {
    subcategoria: 'Limpieza y Desobstrucción de Tuberías',
    problemas: [
      'Desobstrucción de ramal secundario de desagüe de cocina con máquina de cable espiral rotativo K-50',
      'Limpieza profunda y desengrase de colector principal cloacal de 4" mediante hidrojet a 3000 PSI',
      'Desobstrucción manual de sifón y ramal de lavamanos obstruido por cabellos con barrena flexible de 1/4"',
      'Inspección técnica visual de tubería subterránea con cámara endoscópica CCTV de alta definición y localizador',
      'Eliminación de raíces intrusivas en colector de gres/cemento mediante cabezal cortaraíces rotativo',
      'Desatasco de bajante comunitaria pluvial y sanitaria saturada con sonda hidrocinética retropropulsada',
      'Desobstrucción de bote sifónico general de baño con extracción de sedimentos y restitución de estanqueidad',
      'Limpieza química profesional con desincrustante enzimático no corrosivo para cañerías con grasas orgánicas',
      'Desbloqueo de drenaje de ducha obstruido con restos de jabón sódico y cabellos apelmazados',
      'Limpieza mecánica de ramal de desagüe de lavavajillas con extracción de tapón de sarro graso'
    ],
    causas: [
      ['Acumulación continuada de aceites y grasas de cocina que solidifican en las paredes frías de la tubería de PVC', 'Disminución del diámetro interno útil'],
      ['Vertido indebido de toallitas húmedas no biodegradables, apósitos higiénicos o cabellos en los sanitarios'],
      ['Raíces de árboles que penetran por las juntas de goma envejecidas en tuberías exteriores subterráneas'],
      ['Pendiente insuficiente (< 1%) que favorece la sedimentación de partículas sólidas pesadas']
    ],
    materiales: [
      ['Máquina desatascadora seccional eléctrica', 'Cables espirales de 5/8" y 7/8"', 'Juego de cabezales cortadores (bulbo, pala, dentado y espiral)', 'Guantes de cuero reforzado para desatascos'],
      ['Equipo de hidrolavado industrial con manguera de alta presión de 1/4" y tobera retro-propulsada', 'Tanque de agua nodriza', 'Gafas de seguridad y peto impermeable'],
      ['Cámara de inspección con cabezal orientable autonivelante, iluminación LED y transmisor de 512 Hz', 'Monitor de grabación en pendrive con odómetro digital']
    ],
    pasos: [
      [
        'Identificar el registro roscado o arqueta de acceso más próxima a la zona del atoro.',
        'Colocar paños y cubos de retención para contener posibles derrames de aguas servidas.',
        'Seleccionar el cabezal cortador adecuado al tipo de obstrucción (pala para grasa o bulbo para textiles).',
        'Introducir la espiral en la tubería girando en sentido horario a revoluciones controladas.',
        'Al encontrar la resistencia del tapón, avanzar y retroceder el cable con suavidad para fragmentar la masa.',
        'Una vez franqueado el obstáculo, aplicar abundante agua caliente a presión para lavar los restos desprendidos.',
        'Realizar prueba de desagüe masivo vertiendo dos baldes de 20 litros y verificar flujo despejado.'
      ]
    ],
    checklists: [
      [
        'Evacuación inmediata con efecto vórtice en todos los artefactos vinculados al ramal saneado.',
        'Inspección de las uniones de registro: juntas roscadas cerradas con vaselina técnica sin pérdidas.',
        'Zona de trabajo desinfectada con solución de hipoclorito tras finalizar la intervención.',
        'Comprobación por cámara de la eliminación del 100% de los depósitos adheridos a las paredes del tubo.'
      ]
    ],
    basePrice: 75,
    priceVar: 260,
    timeMin: 90,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Drenajes y Ramales Sanitarios',
    problemas: [
      'Instalación de ramal de desagüe de PVC sanitario serie B de 4" con pendiente reglamentaria del 2%',
      'Sustitución de sifón botella cromado en lavabo por sifón articulado con registro de limpieza',
      'Instalación de sumidero o coladera de piso con válvula antirretorno de membrana de silicona antiolores',
      'Sustitución de codo de desagüe de inodoro agrietado con derivación excéntrica para ajuste de distancia a pared',
      'Instalación de tubería de desagüe independiente de 2" para lavadora con cámara sifonada y cuello de ventilación',
      'Reparación de filtración en junta de labio de goma en bajante pluvial con manguito deslizante de dilatación',
      'Instalación de canaleta de drenaje exterior en patio con rejilla de fundición dúctil o acero galvanizado',
      'Corrección de contrapendiente en ramal de evacuación de cocina suspendido bajo forjado'
    ],
    causas: [
      ['Pendiente negativa o nula por asentamiento del falso techo o deformación térmica del tubo de PVC por aguas hirvientes', 'Falta de abrazaderas de soporte cada 80 cm'],
      ['Pérdida del sello hidráulico en sifón por evaporación del agua o por efecto de succión/desifonamiento']
    ],
    materiales: [
      ['Tubería y accesorios de PVC sanitario cédula 40 o serie B de 110mm / 50mm / 40mm', 'Adhesivo limpiador disolvente', 'Pegamento para PVC rígido de alta viscosidad', 'Abrazaderas de fijación con taco'],
      ['Sumidero sifonado de perfil bajo con clapeta magnética anti-retorno y rejilla cuadrada de inox 304'],
      ['Mortero impermeable hidrófugo para impermeabilización de pasamuros']
    ],
    pasos: [
      [
        'Trazar con nivel láser la pendiente mínima del 2% (2 cm de desnivel por cada metro lineal de recorrido).',
        'Cortar los tubos de PVC a escuadra y realizar un chaflán a 15° en los extremos con lima o biselador.',
        'Limpiar las zonas a unir con desengrasante decapante para retirar polvo y abrir el poro del plástico.',
        'Aplicar una capa uniforme de adhesivo disolvente en el manguito y en el extremo del tubo.',
        'Ensamblar las piezas rápidamente sin giro y sostener la unión durante 15 segundos.',
        'Colocar abrazaderas isofónicas con espaciamiento máximo de 1 metro para evitar pandeo.',
        'Realizar prueba de vertido con colorante inocuo para verificar que no queden aguas estancadas.'
      ]
    ],
    checklists: [
      [
        'Pendiente uniforme continua verificada con nivel de burbuja en todo el trazado sin puntos bajos.',
        'Estanqueidad total en todas las juntas pegadas bajo prueba de inundación durante 20 minutos.',
        'Altura del sello de agua en los sifones de al menos 50 mm para garantizar el bloqueo de gases cloacales.'
      ]
    ],
    basePrice: 55,
    priceVar: 170,
    timeMin: 80,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Trampas y Cajas de Grasa',
    problemas: [
      'Instalación de trampa interceptora de grasa de polietileno rotomoldeado de 20 GPM bajo fregadero de restaurante',
      'Limpieza profunda, vaciado y raspado de sedimentos saponificados en trampa de grasa comercial',
      'Sustitución de empaque hermético de neopreno en tapa de caja de grasa para erradicar olores en cocina',
      'Instalación de interceptor de grasa de gran capacidad (500L) enterrado con doble cámara de decantación',
      'Instalación de dosificador automático de bacterias biorremediadoras enzimáticas para degradación de grasas',
      'Reparación de deflector/bafle interno de entrada roto en separador de grasa de acero inoxidable',
      'Mantenimiento mensual preventivo con registro y manifiesto de disposición de residuos de aceites vegetales'
    ],
    causas: [
      ['Saturación del 25% del volumen de la trampa con natas de grasa flotantes y lodos en el fondo', 'Paso directo de aceites hacia la red pública'],
      ['Empaque de la tapa envejecido y pernos de apriete oxidados que permiten la fuga de vapores fétidos'],
      ['Falta de bafle o mampara de retención que provoca turbulencia e impide la separación por densidad']
    ],
    materiales: [
      ['Trampa de grasa de 20 o 50 GPM con canastilla recolectora de sólidos desmontable', 'Sellador anaeróbico o empaque de celda cerrada', 'Llave de tubo para pernos de acero inoxidable'],
      ['Bomba de diafragma para lodos espesos o aspiradora industrial de líquidos', 'Envases homologados para disposición de aceites'],
      ['Bacterias líquidas concentradas para digestión de triglicéridos']
    ],
    pasos: [
      [
        'Asegurar ventilación del área y utilizar mascarilla con filtro para gases orgánicos y guantes de nitrilo.',
        'Retirar los pernos o cierres rápidos de la tapa y desmontarla con cuidado de no romper el empaque.',
        'Extraer la canastilla de sólidos gruesos y vaciar los residuos orgánicos en bolsa para compostaje.',
        'Con pala desnatadora, retirar la capa superior de grasa solidificada acumulada en la cámara.',
        'Aspirar o drenar el lodo asentado en el fondo hasta dejar las paredes visibles.',
        'Raspar las paredes con espátula plástica y lavar con agua a temperatura ambiente (no usar agua hirviendo).',
        'Volver a llenar la trampa con agua limpia fría para restituir el sello hidráulico antes de cerrar la tapa hermética.'
      ]
    ],
    checklists: [
      [
        'La trampa queda llena de agua limpia antes de reiniciar la operación de la cocina (imprescindible para el sellado).',
        'Tapa cerrada con sellado 100% hermético verificado sin escape de olores al pasar vapor.',
        'Manifiesto de entrega de aceites y grasas debidamente firmado para inspección sanitaria ambiental.'
      ]
    ],
    basePrice: 80,
    priceVar: 280,
    timeMin: 110,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Sistemas de Ventilación Sanitaria',
    problemas: [
      'Instalación de válvula de admisión de aire (AAV / Studor) de 2" para evitar desifonamiento sin perforar tejado',
      'Prolongación de columna de ventilación primaria de 3" sobre cubierta con sombrero de ventilación estanco',
      'Corrección de ruido de succión y burbujeo en inodoro por bajante de ventilación obstruida por nidos de aves',
      'Instalación de ventilación secundaria en batería de lavabos para alivio de presiones positivas y negativas',
      'Sellado de pasamuros con manguito de plomo/EPDM en cubierta de teja para terminal de ventilación',
      'Sustitución de válvula AAV bloqueada en posición abierta causante de entrada de gas de alcantarilla al baño'
    ],
    causas: [
      ['Falta de ventilación que crea vacío (presión negativa) cuando se descarga un inodoro, succionando el agua de los sifones contiguos', 'Escape libre de gas metano y sulfhídrico'],
      ['Obstrucción de la salida superior en el tejado por hojas, nidos o escarcha en invierno']
    ],
    materiales: [
      ['Válvula de admisión de aire certificada EN 12380 / ANSI con membrana de silicona de grado alimentario', 'Manguito adaptador de PVC', 'Adhesivo de PVC'],
      ['Sombrero de ventilación de polipropileno con rejilla anti-pájaros', 'Faldón de plomo maleable para impermeabilización de tejado']
    ],
    pasos: [
      [
        'Identificar el artefacto afectado por el ruido de succión (ruido a "gluglú" al vaciar otro artefacto).',
        'Seleccionar una ubicación para la válvula AAV que se encuentre al menos 10 cm por encima del nivel de rebose del artefacto más alto.',
        'Intercalar una derivación en T vertical en la tubería de desagüe accesible bajo el mueble o en la mocheta.',
        'Limpiar y pegar el adaptador hembra para la válvula.',
        'Enroscar o pegar la válvula asegurando verticalidad estricta (desviación máxima < 5°).',
        'Realizar pruebas descargando repetidamente el inodoro para certificar que ningún sifón sufra oscilación.'
      ]
    ],
    checklists: [
      [
        'Cero oscilación en el nivel del agua de los sifones cercanos durante descargas masivas.',
        'La válvula AAV abre suavemente ante la mínima depresión (-10 Pa) y sella herméticamente al cesar.',
        'Ausencia total de olores amoniacales o cloacales en el ambiente del cuarto húmedo.'
      ]
    ],
    basePrice: 50,
    priceVar: 130,
    timeMin: 60,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Cajas de Inspección y Pozos Cloacales',
    problemas: [
      'Construcción y sellado de arqueta de inspección sifónica de 40x40cm con mortero hidrófugo y bruñido',
      'Sustitución de arqueta de obra deteriorada por caja de registro de polipropileno corrugado con tapa estanca',
      'Desobstrucción y saneamiento de pozo general de acometida a colector municipal con equipo pesado',
      'Sellado hermético de tapa de pozo de registro interior con masilla de poliuretano y junta de goma para evitar malos olores',
      'Instalación de válvula antirretorno / válvula de clapeta de 160mm para prevenir inundación por retorno de alcantarillado'
    ],
    causas: [
      ['Infiltraciones de raíces por juntas agrietadas de ladrillo y hormigón antiguo', 'Erosión del canalete de fondo'],
      ['Lluvias torrenciales que saturan la red municipal generando reflujo hacia plantas bajas y sótanos']
    ],
    materiales: [
      ['Arqueta prefabricada de polipropileno 400x400 con entradas troqueladas de 110/160mm', 'Tapa estanca clase A15/B125 con pernos de bloqueo', 'Junta tórica perimetral'],
      ['Válvula de retención con clapeta basculante de acero inoxidable y palanca manual de bloqueo de emergencia', 'Mortero técnico de reparación rápida']
    ],
    pasos: [
      [
        'Abrir zanja y preparar una cama de arena o gravilla compactada de 10 cm de espesor.',
        'Conectar las tuberías de entrada y salida a la caja de registro respetando la pendiente de circulación.',
        'Comprobar que el canalete interior conduzca el flujo sin turbulencias ni ángulos vivos mayores a 45°.',
        'Colocar la junta de estanqueidad en el marco y asentar la tapa a nivel con la rasante del pavimento.',
        'Apretar los pernos inoxidables de fijación de la tapa y verificar hermetismo con prueba de humo o presión.'
      ]
    ],
    checklists: [
      [
        'Flujo continuo sin sedimentación de sólidos en las esquinas de la arqueta.',
        'Tapa estanca que resiste paso peatonal/vehicular sin filtrar gases fétidos ni agua de lluvia hacia el interior.',
        'Palanca de cierre manual de la válvula de clapeta de fácil acceso y maniobra fluida.'
      ]
    ],
    basePrice: 90,
    priceVar: 300,
    timeMin: 140,
    difficulty: 'Avanzado'
  }
];

const MODULE_4_PATTERNS: SubcategoryPattern[] = [
  {
    subcategoria: 'Calentadores de Paso a Gas (Calefones)',
    problemas: [
      'Instalación de calentador instantáneo a gas de tiro forzado de 14L/min con modulación electrónica',
      'Mantenimiento preventivo, desincrustación con ácido cítrico de serpentín de cobre de calefón',
      'Sustitución de membrana de agua de elastómero y engrase de vástago selector de caudal en cuerpo de bronce',
      'Sustitución de par termoeléctrico (termocupla) y electrodo de encendido piezoeléctrico en calentador piloto',
      'Conversión de inyectores de Gas Licuado de Petróleo (GLP) a Gas Natural (GN) con calibración de presión en rampa',
      'Reparación de código de error de evacuación de humos (presostato de aire / ventilador) en calentador estanco',
      'Sustitución de microinterruptor de flujo de encendido por batería en calentador automático',
      'Instalación de chimenea concéntrica coaxial 60/100mm para evacuación de gases de combustión con pendiente al exterior',
      'Corrección de llama amarilla y hollín mediante limpieza de quemadores de acero inoxidable y tobera de venturi',
      'Sustitución de válvula de seguridad de gas solenoide por corte intermitente de llama'
    ],
    causas: [
      ['Calcificación severa de los tubos interiores del serpentín de cobre por agua dura con alto contenido de carbonatos', 'Pérdida de intercambio térmico y reducción drástica de caudal'],
      ['Rotura o estiramiento de la membrana de caucho que impide accionar el émbolo de apertura de gas al abrir el grifo'],
      ['Termocupla envejecida que no genera los 20-30 milivoltios necesarios para retener el electroimán de seguridad'],
      ['Presión de agua inferior a la presión mínima de encendido del calefón (menos de 0.2 bar / 3 PSI)']
    ],
    materiales: [
      ['Calentador de paso estanco', 'Kit de chimenea coaxial', 'Manguera flexible de gas aprobada con malla metálica', 'Llave de paso de gas de 1/2" con mango amarillo', 'Llaves de corte de agua de esfera'],
      ['Bomba de recirculación desincrustante', 'Ácido desincrustante cítrico biodegradable', 'Mangueras reforzadas de conexión con racores de 1/2"'],
      ['Membrana de agua de recambio específica del modelo', 'Grasa grafitada/siliconada para fontanería', 'Juntas de estanqueidad de fibra'],
      ['Juego de inyectores de latón calibrados para Gas Natural', 'Detector de gas en spray para fugas']
    ],
    pasos: [
      [
        'Cerrar la llave de paso de gas y desconectar el suministro eléctrico o retirar las baterías.',
        'Cerrar la entrada de agua fría y vaciar el calentador abriendo la válvula de purga.',
        'Desconectar las conexiones de agua y retirar la carcasa frontal del aparato.',
        'Desmontar el cuerpo de agua de bronce aflojando los tornillos de fijación al cuerpo de gas.',
        'Abrir el cuerpo de agua retirando la membrana vieja y limpiar la cámara interior de sedimentos.',
        'Instalar la nueva membrana con el platillo centrado y lubricar el eje de empuje con grasa de silicona.',
        'Reensamblar el cuerpo apretando tornillos en cruz, reconectar y purgar aire abriendo grifo de caliente.',
        'Abrir llave de gas, encender el equipo y comprobar ausencia total de fugas con spray detector de pompas.'
      ]
    ],
    checklists: [
      [
        'Cero fugas de gas comprobadas con detector de gas calibrado o agua jabonosa en todas las roscas.',
        'Encendido suave y silencioso de los quemadores sin explosiones ni deflagraciones tardías.',
        'Llama azul compacta y estable sin puntas amarillas ni producción de monóxido de carbono.',
        'El calentador enciende con un caudal mínimo de 2.5 litros por minuto.'
      ]
    ],
    basePrice: 85,
    priceVar: 260,
    timeMin: 90,
    difficulty: 'Avanzado'
  },
  {
    subcategoria: 'Termotanques Eléctricos',
    problemas: [
      'Instalación mural de calentador de agua por acumulación (termotanque eléctrico) de 80 Litros con anclaje reforzado',
      'Sustitución de resistencia blindada sumergida de 2000W atacada por caliza con junta de pletina',
      'Reemplazo de barra de ánodo de sacrificio de magnesio de 3/4" NPT para protección catódica del calderín',
      'Sustitución de termostato de regulación de temperatura con rearme manual de seguridad por sobrecalentamiento',
      'Instalación de válvula de seguridad y retención combinada de 8 bar con palanca de purga manual',
      'Vaciado completo y purga de lodos calcáreos del fondo de calderín esmaltado de termotanque',
      'Instalación de manguitos dieléctricos electrolíticos de poliamida en entrada de fría y salida de caliente',
      'Reparación de goteo continuo por la pipeta de descarga de la válvula de sobrepresión'
    ],
    causas: [
      ['Desgaste y consumo total del ánodo de magnesio, provocando perforación del calderín vitrificado por corrosión galvánica', 'Falta de revisión anual obligatoria'],
      ['Resistencia eléctrica cubierta por una costra de sarro de 5mm que actúa como aislante térmico, fundiendo el filamento interior por sobrecalentamiento'],
      ['Dilatación térmica del agua durante el calentamiento que supera el tarado de la válvula de seguridad (8 bar) al no disponer de vaso de expansión']
    ],
    materiales: [
      ['Termotanque eléctrico 80L', 'Ganchos de anclaje de acero M10 de expansión pesada', 'Manguitos antielectrólisis de 1/2"', 'Válvula de seguridad de 8 bar con válvula antirretorno incorporada', 'Latiguillos inox de 1/2"'],
      ['Resistencia blindada de 1500W / 2000W tipo rosca o pletina con porta-ánodo', 'Ánodo de magnesio de 21x400mm', 'Junta de brida de goma EPDM'],
      ['Termostato de varilla bipolar con corte térmico a 95°C', 'Llave de vaso o tubular de 55mm']
    ],
    pasos: [
      [
        'Desconectar el termotanque de la red eléctrica bajando el diferencial en el cuadro principal.',
        'Cerrar la llave de entrada de agua fría al aparato.',
        'Conectar una manguera a la válvula de seguridad o vaciado y abrir un grifo de agua caliente para que entre aire y drene el tanque por completo.',
        'Retirar la tapa plástica inferior y desconectar el cableado eléctrico tomando foto previa de conexiones.',
        'Extraer el termostato de varilla tirando firmemente hacia abajo.',
        'Desenroscar los pernos de la pletina o la tuerca central de la resistencia con llave adecuada.',
        'Extraer la resistencia y el ánodo viejo desgastado, limpiando a mano los trozos de cal del fondo del depósito.',
        'Colocar el nuevo ánodo de magnesio, la nueva resistencia y una junta de goma nueva.',
        'Volver a montar la brida, llenar el termo completamente de agua ANTES de reconectar la corriente eléctrica.'
      ]
    ],
    checklists: [
      [
        'Termotanque completamente lleno de agua sin aire antes de activar la electricidad para no quemar la resistencia en seco.',
        'Manguitos dieléctricos instalados en ambas tomas para prevenir el par galvánico cobre-acero.',
        'Válvula de seguridad canalizada con tubo rígido hacia desagüe visible para evitar quemaduras.',
        'Termostato calibrado entre 55°C y 60°C para inhibir la proliferación de Legionella sin generar calcificación acelerada.'
      ]
    ],
    basePrice: 65,
    priceVar: 170,
    timeMin: 80,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Sistemas Solares Térmicos',
    problemas: [
      'Mantenimiento anual de calentador solar termosifónico por gravedad con colector de 20 tubos de vacío Borosilicato 3.3',
      'Sustitución de tubo de vacío de colector solar roto por impacto de granizo o choque térmico',
      'Reemplazo de sellos y juntas antipolvo de silicona de alta temperatura en cabezal de termotanque solar',
      'Instalación de válvula mezcladora termostática solar antiquemaduras calibrada a 45°C en salida de agua caliente',
      'Relleno y purga de fluido caloportador (propilenglicol atóxico) en circuito primario solar forzado',
      'Sustitución de controlador diferencial solar electrónico con sensores de temperatura PT1000 en colector y depósito',
      'Sustitución de válvula de alivio solar de presión calibrada a 3 bar y 160°C en circuito primario cerrado'
    ],
    causas: [
      ['Llenado de tubos de vacío a pleno sol con agua fría produciendo rotura instantánea por choque térmico', 'Granizo de gran diámetro sin malla de protección'],
      ['Degradación térmica y acidificación del glicol solar por estancamiento estival prolongado sin consumo de agua caliente'],
      ['Agua a temperaturas extremas (>85°C) que genera riesgo crítico de escaldadura severa si no se mezcla termostáticamente']
    ],
    materiales: [
      ['Tubos de vacío de vidrio borosilicato 3.3 tricapa de 58mm x 1800mm', 'Sellos de silicona de grado alimentario resistentes a 200°C', 'Pasta térmica conductora'],
      ['Válvula mezcladora termostática antiquemaduras solar de alta gama de 3/4" o 1"', 'Termómetros bimetálicos de contacto'],
      ['Fluido térmico solar a base de propilenglicol al 40% con inhibidores de corrosión', 'Bomba de llenado manual']
    ],
    pasos: [
      [
        'Realizar la intervención a primera hora de la mañana o cubrir los colectores solares con lona opaca para evitar sobrecalentamiento.',
        'Drenar parcialmente el termotanque solar hasta situar el nivel bajo el tubo a reemplazar.',
        'Lubricar el extremo del nuevo tubo de vacío con agua jabonosa neutra (nunca aceite mineral).',
        'Insertar el tubo en el orificio del tanque girándolo suavemente hasta calzar en el asiento de silicona superior.',
        'Bajar el extremo inferior y asegurarlo en el soporte de copa plástico de la estructura metálica.',
        'Verificar el posicionamiento de la junta guardapolvo exterior contra la camisa metálica del tanque.',
        'Llenar el equipo lentamente con agua a primera hora del día y comprobar hermeticidad.'
      ]
    ],
    checklists: [
      [
        'La válvula mezcladora entrega agua al hogar a no más de 48°C independientemente de la temperatura del tanque solar.',
        'Tubos de vacío limpios, con brillo plateado intacto en la punta indicando que conservan el vacío perfecto.',
        'Estructura de soporte sólidamente anclada a la cubierta resistiendo vientos de hasta 120 km/h.'
      ]
    ],
    basePrice: 80,
    priceVar: 240,
    timeMin: 100,
    difficulty: 'Avanzado'
  },
  {
    subcategoria: 'Válvulas de Seguridad y Vasos de Expansión',
    problemas: [
      'Instalación de válvula de seguridad de temperatura y presión (T&P Relief Valve) de 150 PSI y 210°F (99°C) con vástago largo',
      'Instalación de vaso de expansión cerrado para agua caliente sanitaria (ACS) de 12L con membrana fija apta para agua potable',
      'Prueba de accionamiento manual y descalcificación de válvula de alivio de sobrepresión',
      'Sustitución de vaso de expansión desinflado o pinchado que provoca disparos de agua en la válvula de alivio',
      'Canalización en tubería de cobre rígido de descarga de válvula de alivio hasta 15 cm del suelo en punto seguro'
    ],
    causas: [
      ['Inexistencia de vaso de expansión en circuito cerrado que amortigüe el incremento del 3% del volumen del agua caliente', 'Picos de presión que vencen el muelle de la válvula'],
      ['Sedimentos de caliza que traban el obturador de la válvula impidiendo su apertura en caso de emergencia por sobrecalentamiento']
    ],
    materiales: [
      ['Válvula de alivio T&P de 3/4" NPT con cuerpo de bronce forjado y sonda térmica de cobre', 'Cinta teflón de alta densidad para alta temperatura'],
      ['Vaso de expansión para ACS de 8L/12L/18L presurizado a 3 bar con conexión inox de 3/4"', 'Soporte mural con abrazadera'],
      ['Tubería de cobre rígido de 3/4" tipo L con accesorios soldables']
    ],
    pasos: [
      [
        'Apagar el sistema de calentamiento de agua y esperar a que la temperatura descienda por debajo de 40°C.',
        'Despresurizar el circuito abriendo un grifo de agua caliente.',
        'Desenroscar la válvula de seguridad averiada del orificio específico superior o lateral del tanque.',
        'Limpiar la rosca hembra del calderín con cepillo de alambre blando.',
        'Aplicar sellador de roscas para alta temperatura en la rosca macho de la nueva válvula T&P.',
        'Enroscar y orientar la boca de salida hacia abajo.',
        'Conectar una tubería de descarga continua sin estrangulamientos ni llaves de paso intermedias hasta cerca del suelo.'
      ]
    ],
    checklists: [
      [
        'La tubería de descarga no tiene rosca en su extremo final (para evitar que alguien enrosque un tapón).',
        'La palanca de prueba manual abre y cierra con resorte firme y estanco al soltar.',
        'Precarga de aire del vaso de expansión calibrada a la misma presión que la red de entrada de agua fría.'
      ]
    ],
    basePrice: 55,
    priceVar: 130,
    timeMin: 60,
    difficulty: 'Intermedio'
  },
  {
    subcategoria: 'Bombas Recirculadoras de Agua Caliente',
    problemas: [
      'Instalación de bomba recirculadora de ACS de rotor húmedo de bronce con termostato y reloj temporizador programable',
      'Instalación de circuito de retorno de agua caliente con tubería aislada con coquilla elastomérica de 13mm',
      'Sustitución de válvula check de retención especial para alta temperatura en línea de retorno de ACS',
      'Desbloqueo manual del eje de bomba recirculadora parada tras temporada estival con tornillo frontal',
      'Instalación de sensor de flujo inteligente activador de bomba recirculadora bajo demanda mediante pulsador o sensor'
    ],
    causas: [
      ['Gasto de hasta 15 litros de agua fría esperando a que llegue el agua caliente a los cuartos de baño lejanos', 'Falta de línea de retorno'],
      ['Bloqueo del rotor cerámico por incrustación de sarro durante periodos de inactividad prolongada']
    ],
    materiales: [
      ['Bomba circuladora de ACS con cuerpo de latón/bronce homologado para agua de consumo', 'Válvula de retención de 1/2" con muelle inoxidable'],
      ['Coquilla aislante de espuma elastomérica resistente a 105°C con cinta adhesiva de sellado térmico', 'Termostato de contacto para tubería']
    ],
    pasos: [
      [
        'Cerrar el circuito de agua caliente y aislar las llaves de corte de la línea de recirculación.',
        'Instalar la bomba recirculadora en la tubería de retorno antes de la entrada al acumulador de agua caliente.',
        'Respetar el sentido de circulación del agua hacia el depósito indicado por la flecha del cuerpo.',
        'Instalar la válvula de retención a la salida de la bomba para evitar flujo inverso.',
        'Aislar térmicamente toda la tubería para evitar disipación pasiva de calor.',
        'Ajustar el temporizador para funcionar únicamente en los horarios habituales de consumo familiar.',
        'Purgar el aire del cuerpo de la bomba aflojando el tornillo central hasta que gotee agua caliente continua.'
      ]
    ],
    checklists: [
      [
        'Disponibilidad de agua caliente en grifos lejanos en menos de 4 segundos tras abrir la llave.',
        'Pérdida de temperatura en el anillo de recirculación inferior a 5°C gracias al aislamiento elastomérico.',
        'Bomba funciona silenciosamente sin vibración apreciable en las abrazaderas de sujeción.'
      ]
    ],
    basePrice: 85,
    priceVar: 210,
    timeMin: 90,
    difficulty: 'Avanzado'
  }
];

const MODULE_5_PATTERNS = [
  {
    sintoma: 'El inodoro pierde agua continuamente hacia la taza haciendo un ruido de silbido permanente',
    causa: 'Flapper o sapito de goma deformado por cloro/químicos o flotador descalibrado superando el nivel del tubo de rebose',
    solucao: 'Ajustar el tornillo de la boya para que corte 2.5 cm bajo el rebose o reemplazar el flapper por uno de silicona virgen',
    herramientas: ['Llave ajustable 10"', 'Flapper de recambio 2"', 'Paño seco'],
    urgencia: 'Media' as const,
    categoria: 'Inodoros y Fugas',
    basePrice: 45
  },
  {
    sintoma: 'Golpe metálico seco y vibración violenta en las paredes al cerrar monomandos o parar la lavadora',
    causa: 'Golpe de ariete por inercia del fluido y cierre instantáneo de válvulas en instalaciones sin amortiguadores',
    solucao: 'Instalar supresores de golpe de ariete de pistón mecánico precargado en las tomas más cercanas a las electroválvulas',
    herramientas: ['Cortatubos de cobre/PEX', 'Tee de derivación 3/4"', 'Supresor de golpe de ariete', 'Teflón PTFE'],
    urgencia: 'Alta' as const,
    categoria: 'Suministro y Presión',
    basePrice: 65
  },
  {
    sintoma: 'Olor fétido a cloaca o alcantarilla en el baño a pesar de que los pisos y sanitarios están limpios',
    causa: 'Pérdida del sello de agua en sumidero de piso por evaporación o desifonamiento inducido por falta de ventilación sanitaria',
    solucao: 'Rellenar el sello de agua vertiendo 1L de agua con una cucharada de glicerina o instalar válvula de admisión de aire (AAV)',
    herramientas: ['Válvula AAV 2"', 'Adhesivo PVC', 'Cinta métrica'],
    urgencia: 'Alta' as const,
    categoria: 'Desagües y Olores',
    basePrice: 55
  },
  {
    sintoma: 'El calentador de paso a gas se apaga súbitamente a los 2 o 3 minutos de abrir la ducha',
    causa: 'Sensor térmico de evacuación de humos (clixon) corta por acumulación de gases por chimenea obstruida o tiro insuficiente',
    solucao: 'Deshollinar y verificar la pendiente ascendente de la chimenea de evacuación de humos y limpiar el deflector',
    herramientas: ['Cepillo deshollinador', 'Destornillador Torx/estrella', 'Multímetro comprobador'],
    urgencia: 'Emergencia' as const,
    categoria: 'Calentadores a Gas',
    basePrice: 90
  },
  {
    sintoma: 'La bomba de agua arranca y se apaga de forma frenética cada 3 a 5 segundos mientras se usa un grifo',
    causa: 'Pérdida total del colchón de aire de precarga en el tanque hidroneumático o membrana rota llena de agua',
    solucao: 'Vaciar de agua el tanque, comprobar membrana y recargar aire con inflador a 2 PSI bajo la presión de encendido',
    herramientas: ['Bomba de aire con manómetro', 'Llave de purga', 'Obús de válvula nuevo'],
    urgencia: 'Media' as const,
    categoria: 'Bombas y Presurización',
    basePrice: 60
  },
  {
    sintoma: 'Burbujeo y ruido a "gluglú" en el sifón del lavabo cuando se descarga el inodoro del mismo baño',
    causa: 'Depresión por vacío en la bajante sanitaria provocada por ventilación obstruida que succiona los sellos hidráulicos',
    solucao: 'Destapar el sombrerete de ventilación en cubierta o instalar una válvula Studor de admisión de aire bajo el lavamanos',
    herramientas: ['Válvula de admisión Studor', 'Adaptador de PVC 50mm', 'Pegamento disolvente'],
    urgencia: 'Media' as const,
    categoria: 'Ventilaciones y Drenajes',
    basePrice: 55
  },
  {
    sintoma: 'El agua caliente sale tibia o con poco caudal mientras que el agua fría tiene excelente presión',
    causa: 'Serpentín de cobre del calentador calcificado con sarro mineral o filtro de entrada de agua fría del calefón tapado',
    solucao: 'Desmontar el serpentín y realizar un lavado químico recirculando desincrustante ácido cítrico diluido durante 40 min',
    herramientas: ['Bomba recirculadora desincrustante', 'Ácido cítrico grado alimentario', 'Cubeta plástica y mangueras'],
    urgencia: 'Media' as const,
    categoria: 'Agua Caliente Sanitaria',
    basePrice: 95
  },
  {
    sintoma: 'Goteo continuo por la pipeta de desagüe de la válvula de seguridad del termotanque eléctrico',
    causa: 'Presión de red que supera los 8 bar durante la dilatación del calentamiento al no existir vaso de expansión',
    solucao: 'Instalar un vaso de expansión para ACS de 8L presurizado a 3 bar y una válvula reductora en la acometida',
    herramientas: ['Vaso de expansión 8L', 'Tee de latón 3/4"', 'Válvula reductora de presión', 'Manómetro'],
    urgencia: 'Baja' as const,
    categoria: 'Termotanques Eléctricos',
    basePrice: 75
  },
  {
    sintoma: 'Agua que sube y rebosa lentamente por la coladera de la ducha cuando se vacía la bacha del lavabo',
    causa: 'Obstrucción parcial en el colector secundario común de 50mm aguas abajo del empalme de ambos aparatos',
    solucao: 'Introducir sonda espiral rotativa por el registro del bote sifónico o desatascador de succión mecánica',
    herramientas: ['Sonda espiral de 1/4"', 'Guantes reforzados', 'Desatascador de émbolo'],
    urgencia: 'Alta' as const,
    categoria: 'Desagües y Esgotos',
    basePrice: 70
  },
  {
    sintoma: 'Chorro irregular con salpicaduras y silbido molesto al abrir el grifo monomando de cocina',
    causa: 'Filtro atomizador / aireador de la punta del caño colmatado de arenilla y cristales de caliza',
    solucao: 'Desenroscar la boquilla del aireador con llave protegida, desarmar las mallas y sumergir en vinagre blanco caliente',
    herramientas: ['Llave inglesa suave', 'Vinagre concentrado', 'Cepillo de dientes viejo'],
    urgencia: 'Baja' as const,
    categoria: 'Griferías y Mantenimiento',
    basePrice: 30
  }
];

// Systematic, high-fidelity procedural generation function yielding 2,850+ records
export function generatePlumbingDatabase(): PlumbingRecord[] {
  const records: PlumbingRecord[] = [];
  let globalIdCounter = 1;

  const padId = (num: number, prefix: string) => `${prefix}-${String(num).padStart(4, '0')}`;

  // 1. MODULE 1: Baños y Cocinas (Target: 700 records)
  // Let's iterate through patterns with variations: pipes, fixture brands, floor types, room types
  const pipeMaterials = [
    'Tubería PPR Termofusionada',
    'Tubería de Cobre Soldado',
    'Tubería PEX con Prensado Radial',
    'Tubería CPVC Hidráulica',
    'Tubería Multicapa PE-RT/AL'
  ];
  const locations = ['Baño Principal', 'Baño de Visitas', 'Cocina Residencial', 'Cocina Comercial', 'Área de Lavandería', 'Suite de Hotel'];
  const complexities: ('Básico' | 'Intermedio' | 'Avanzado' | 'Especialista')[] = ['Básico', 'Intermedio', 'Avanzado', 'Especialista'];

  let m1Counter = 1;
  while (m1Counter <= 700) {
    for (const pattern of MODULE_1_PATTERNS) {
      if (m1Counter > 700) break;
      for (const prob of pattern.problemas) {
        if (m1Counter > 700) break;
        const pipeMat = pipeMaterials[m1Counter % pipeMaterials.length];
        const loc = locations[m1Counter % locations.length];
        const diff = complexities[(m1Counter + pattern.basePrice) % complexities.length];
        const price = Math.round(pattern.basePrice + ((m1Counter * 17) % pattern.priceVar) + 15);

        const causasList = pattern.causas[m1Counter % pattern.causas.length];
        const matList = [...pattern.materiales[m1Counter % pattern.materiales.length], `Compatible con: ${pipeMat}`];
        const stepsList = pattern.pasos[m1Counter % pattern.pasos.length];
        const checkList = pattern.checklists[m1Counter % pattern.checklists.length];

        const record: PlumbingRecord = {
          id: padId(globalIdCounter, 'M1-BC'),
          moduloId: 1,
          modulo: 'Módulo 1: Baños y Cocinas',
          categoria: `Baños y Cocinas - ${pattern.subcategoria}`,
          subcategoria: pattern.subcategoria,
          problemaServicio: `${prob} en ${loc} (${pipeMat})`,
          causasProvaveis: causasList,
          materialNecessario: matList,
          passoAPassoTecnico: stepsList,
          checklistFinal: checkList,
          precoSugeridoUSD: price,
          tempoEstimadoMinutos: pattern.timeMin + ((m1Counter * 7) % 45),
          nivelDificuldade: diff
        };

        records.push(record);
        globalIdCounter++;
        m1Counter++;
      }
    }
  }

  // 2. MODULE 2: Suministro y Presión (Target: 600 records)
  const pumpCapacities = ['0.5 HP', '1.0 HP', '1.5 HP', '2.0 HP', '3.0 HP Variable'];
  const pressureTiers = ['20-40 PSI', '30-50 PSI', '40-60 PSI', 'Presión Constante 4 bar con VFD'];
  let m2Counter = 1;

  while (m2Counter <= 600) {
    for (const pattern of MODULE_2_PATTERNS) {
      if (m2Counter > 600) break;
      for (const prob of pattern.problemas) {
        if (m2Counter > 600) break;
        const pumpCap = pumpCapacities[m2Counter % pumpCapacities.length];
        const pressTier = pressureTiers[m2Counter % pressureTiers.length];
        const diff = complexities[(m2Counter + 1) % complexities.length];
        const price = Math.round(pattern.basePrice + ((m2Counter * 23) % pattern.priceVar) + 20);

        const causasList = pattern.causas[m2Counter % pattern.causas.length];
        const matList = [...pattern.materiales[m2Counter % pattern.materiales.length], `Tarado hidráulico para: ${pressTier}`];
        const stepsList = pattern.pasos[m2Counter % pattern.pasos.length];
        const checkList = pattern.checklists[m2Counter % pattern.checklists.length];

        const record: PlumbingRecord = {
          id: padId(globalIdCounter, 'M2-SP'),
          moduloId: 2,
          modulo: 'Módulo 2: Suministro y Presión',
          categoria: `Suministro y Presión - ${pattern.subcategoria}`,
          subcategoria: pattern.subcategoria,
          problemaServicio: `${prob} [Sistema ${pumpCap}, Rango ${pressTier}]`,
          causasProvaveis: causasList,
          materialNecessario: matList,
          passoAPassoTecnico: stepsList,
          checklistFinal: checkList,
          precoSugeridoUSD: price,
          tempoEstimadoMinutos: pattern.timeMin + ((m2Counter * 11) % 60),
          nivelDificuldade: diff
        };

        records.push(record);
        globalIdCounter++;
        m2Counter++;
      }
    }
  }

  // 3. MODULE 3: Desagües y Esgotos (Target: 600 records)
  const diameters = ['Tubería Ø 40mm (1-1/2")', 'Tubería Ø 50mm (2")', 'Tubería Ø 75mm (3")', 'Tubería Ø 110mm (4")', 'Colector Ø 160mm (6")'];
  const buildings = ['Vivienda Unifamiliar', 'Edificio Residencial', 'Restaurante / Hostelería', 'Planta Industrial Liviana', 'Centro Hospitalario'];
  let m3Counter = 1;

  while (m3Counter <= 600) {
    for (const pattern of MODULE_3_PATTERNS) {
      if (m3Counter > 600) break;
      for (const prob of pattern.problemas) {
        if (m3Counter > 600) break;
        const diam = diameters[m3Counter % diameters.length];
        const bld = buildings[m3Counter % buildings.length];
        const diff = complexities[(m3Counter + 2) % complexities.length];
        const price = Math.round(pattern.basePrice + ((m3Counter * 19) % pattern.priceVar) + 25);

        const causasList = pattern.causas[m3Counter % pattern.causas.length];
        const matList = [...pattern.materiales[m3Counter % pattern.materiales.length], `Especificación de diámetro: ${diam}`];
        const stepsList = pattern.pasos[m3Counter % pattern.pasos.length];
        const checkList = pattern.checklists[m3Counter % pattern.checklists.length];

        const record: PlumbingRecord = {
          id: padId(globalIdCounter, 'M3-DE'),
          moduloId: 3,
          modulo: 'Módulo 3: Desagües y Esgotos',
          categoria: `Desagües y Esgotos - ${pattern.subcategoria}`,
          subcategoria: pattern.subcategoria,
          problemaServicio: `${prob} en ${bld} (${diam})`,
          causasProvaveis: causasList,
          materialNecessario: matList,
          passoAPassoTecnico: stepsList,
          checklistFinal: checkList,
          precoSugeridoUSD: price,
          tempoEstimadoMinutos: pattern.timeMin + ((m3Counter * 9) % 50),
          nivelDificuldade: diff
        };

        records.push(record);
        globalIdCounter++;
        m3Counter++;
      }
    }
  }

  // 4. MODULE 4: Calentadores y Agua Caliente (Target: 500 records)
  const heaterCapacities = ['11 L/min Gas', '14 L/min Gas Estanco', '50 Litros Eléctrico', '80 Litros Eléctrico', '120 Litros Eléctrico', 'Termotanque Solar 200L'];
  const energySources = ['Gas LP (Propano/Butano)', 'Gas Natural de Red', 'Eléctrico 220V/60Hz', 'Energía Solar con Apoyo Eléctrico'];
  let m4Counter = 1;

  while (m4Counter <= 500) {
    for (const pattern of MODULE_4_PATTERNS) {
      if (m4Counter > 500) break;
      for (const prob of pattern.problemas) {
        if (m4Counter > 500) break;
        const heatCap = heaterCapacities[m4Counter % heaterCapacities.length];
        const energySrc = energySources[m4Counter % energySources.length];
        const diff = complexities[(m4Counter + 3) % complexities.length];
        const price = Math.round(pattern.basePrice + ((m4Counter * 29) % pattern.priceVar) + 30);

        const causasList = pattern.causas[m4Counter % pattern.causas.length];
        const matList = [...pattern.materiales[m4Counter % pattern.materiales.length], `Suministro de energía: ${energySrc}`];
        const stepsList = pattern.pasos[m4Counter % pattern.pasos.length];
        const checkList = pattern.checklists[m4Counter % pattern.checklists.length];

        const record: PlumbingRecord = {
          id: padId(globalIdCounter, 'M4-CA'),
          moduloId: 4,
          modulo: 'Módulo 4: Calentadores y Agua Caliente',
          categoria: `Calentadores y Agua Caliente - ${pattern.subcategoria}`,
          subcategoria: pattern.subcategoria,
          problemaServicio: `${prob} [${heatCap} - ${energySrc}]`,
          causasProvaveis: causasList,
          materialNecessario: matList,
          passoAPassoTecnico: stepsList,
          checklistFinal: checkList,
          precoSugeridoUSD: price,
          tempoEstimadoMinutos: pattern.timeMin + ((m4Counter * 13) % 65),
          nivelDificuldade: diff
        };

        records.push(record);
        globalIdCounter++;
        m4Counter++;
      }
    }
  }

  // 5. MODULE 5: Diagnóstico Rápido (Sintoma → Causa → Solução) (Target: 450 records)
  // Let's create granular diagnostic rows with specific Symptom -> Cause -> Solution matrix
  let m5Counter = 1;
  const fixtureScopes = [
    'en Inodoro Principal',
    'en Inodoro Secundario',
    'en Grifo de Cocina',
    'en Grifo de Lavamanos',
    'en Ducha Termostática',
    'en Calentador Instantáneo',
    'en Termotanque Eléctrico',
    'en Bomba Presurizadora',
    'en Tubería Matriz de Suministro',
    'en Caja de Grasa',
    'en Bajante Sanitaria',
    'en Fosa Séptica / Pozo'
  ];

  while (m5Counter <= 450) {
    for (const baseDiag of MODULE_5_PATTERNS) {
      if (m5Counter > 450) break;
      const scope = fixtureScopes[m5Counter % fixtureScopes.length];
      const diff = complexities[m5Counter % complexities.length];
      const price = Math.round(baseDiag.basePrice + ((m5Counter * 13) % 110) + 10);

      const diagData: DiagnosticData = {
        sintoma: `${baseDiag.sintoma} (${scope})`,
        causa: baseDiag.causa,
        solucao: baseDiag.solucao,
        herramientas: [...baseDiag.herramientas],
        urgencia: baseDiag.urgencia
      };

      const record: PlumbingRecord = {
        id: padId(globalIdCounter, 'M5-DR'),
        moduloId: 5,
        modulo: 'Módulo 5: Diagnóstico Rápido',
        categoria: `Diagnóstico Rápido - ${baseDiag.categoria}`,
        subcategoria: baseDiag.categoria,
        problemaServicio: `Diagnóstico: ${baseDiag.sintoma} (${scope})`,
        causasProvaveis: [baseDiag.causa, 'Fatiga de material por ciclos de uso', 'Variación de presión hidráulica o acumulación de caliza'],
        materialNecessario: baseDiag.herramientas,
        passoAPassoTecnico: [
          `Paso 1: Identificación y aislamiento: Localizar el origen de "${baseDiag.sintoma}".`,
          `Paso 2: Diagnóstico de causa raíz: Comprobar "${baseDiag.causa}".`,
          `Paso 3: Aplicación de la solución: ${baseDiag.solucao}.`,
          `Paso 4: Verificación operativa: Abrir suministro de agua y comprobar respuesta bajo presión de trabajo.`
        ],
        checklistFinal: [
          'Verificación de desaparición total del síntoma reportado.',
          'Ausencia de fugas o goteos en uniones manipuladas tras 10 minutos presurizado.',
          'Explicación al cliente de las causas de la avería y medidas de mantenimiento preventivo.'
        ],
        precoSugeridoUSD: price,
        tempoEstimadoMinutos: 45 + ((m5Counter * 5) % 45),
        nivelDificuldade: diff,
        diagnosticoRapido: diagData
      };

      records.push(record);
      globalIdCounter++;
      m5Counter++;
    }
  }

  return records;
}

// Module metadata summary for UI navigation and overview
export const MODULE_METADATA = [
  {
    id: 1 as const,
    title: 'Módulo 1: Baños y Cocinas',
    shortName: 'Baños y Cocinas',
    iconName: 'Bath',
    count: 700,
    description: 'Instalaciones completas, detección y sellado de fugas, cambios de grifería monomando/bimando, inodoros y duchas.',
    color: 'emerald'
  },
  {
    id: 2 as const,
    title: 'Módulo 2: Suministro y Presión',
    shortName: 'Suministro y Presión',
    iconName: 'Gauge',
    count: 600,
    description: 'Tanques elevados, cisternas, bombas sumergibles de pozo y achique, grupos hidroneumáticos, purga de aire y golpe de ariete.',
    color: 'blue'
  },
  {
    id: 3 as const,
    title: 'Módulo 3: Desagües y Esgotos',
    shortName: 'Desagües y Esgotos',
    iconName: 'Waves',
    count: 600,
    description: 'Limpieza mecánica e hidrojet de tuberías, drenajes sanitarios, cajas y trampas de grasa, columnas de ventilación y arquetas.',
    color: 'amber'
  },
  {
    id: 4 as const,
    title: 'Módulo 4: Calentadores y Agua Caliente',
    shortName: 'Calentadores y ACS',
    iconName: 'Flame',
    count: 500,
    description: 'Instalación y mantenimiento de calentadores a gas instantáneos, termotanques eléctricos, termos solares y válvulas T&P.',
    color: 'rose'
  },
  {
    id: 5 as const,
    title: 'Módulo 5: Diagnóstico Rápido',
    shortName: 'Diagnóstico Rápido',
    iconName: 'Activity',
    count: 450,
    description: 'Matriz técnica de diagnóstico directo "Sintoma → Causa → Solução", herramientas clave, niveles de urgencia y solución inmediata.',
    color: 'purple'
  }
];
