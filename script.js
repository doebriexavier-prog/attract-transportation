
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle && menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

nav && nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle && menuToggle.setAttribute("aria-expanded", "false");
  });
});

const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header && header.classList.toggle("scrolled", window.scrollY > 20);
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 450);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* Fleet hero slider */
const fleetSlider = document.querySelector(".fleet-slider");
if (fleetSlider) {
  const fleetSlides = fleetSlider.querySelectorAll(".fleet-slide");
  const fleetDots = document.querySelectorAll(".fleet-dot");
  const fleetPrevBtn = document.querySelector(".fleet-arrow-prev");
  const fleetNextBtn = document.querySelector(".fleet-arrow-next");
  let fleetCurrentIndex = 0;

  function updateFleetSlide() {
    fleetSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === fleetCurrentIndex);
    });
    fleetDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === fleetCurrentIndex);
    });
  }

  function showNextFleetSlide() {
    fleetCurrentIndex = (fleetCurrentIndex + 1) % fleetSlides.length;
    updateFleetSlide();
  }

  function showPreviousFleetSlide() {
    fleetCurrentIndex = (fleetCurrentIndex - 1 + fleetSlides.length) % fleetSlides.length;
    updateFleetSlide();
  }

  fleetPrevBtn && fleetPrevBtn.addEventListener("click", showPreviousFleetSlide);
  fleetNextBtn && fleetNextBtn.addEventListener("click", showNextFleetSlide);
  fleetDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      fleetCurrentIndex = index;
      updateFleetSlide();
    });
  });
}

/* Fleet Option Card Sliders */
document.querySelectorAll(".fleet-option-card").forEach(card => {
  const slider = card.querySelector(".fleet-option-slider");
  const slides = card.querySelectorAll(".fleet-option-slide");
  const dots = card.querySelectorAll(".fleet-option-dot");
  const prevBtn = card.querySelector(".fleet-option-arrow.prev");
  const nextBtn = card.querySelector(".fleet-option-arrow.next");
  
  let currentIndex = 0;
  
  function updateSlide() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("is-active", idx === currentIndex);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === currentIndex);
    });
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  }
  
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      currentIndex = idx;
      updateSlide();
    });
  });
});

/* ---------------- LANGUAGE SYSTEM ----------------
   English / Español / Nederlands / Français / Português
   The language is stored in localStorage and applied to
   every page using the same shared script.
---------------------------------------------------- */

const translations = {
  es: {
    "Home":"Inicio","Services":"Servicios","Our Fleet":"Nuestra Flota","About":"Nosotros","Contact":"Contacto",
    "BookMyRide":"Reservar viaje","TRANSPORTATION • SURINAME":"TRANSPORTE • SURINAM",
    "YOUR JOURNEY.":"TU VIAJE.","OUR PRIORITY.":"NUESTRA PRIORIDAD.",
    "Reliable transportation for airport transfers, business teams and corporate travel — with comfort and professionalism every step of the way.":"Transporte confiable para traslados al aeropuerto, equipos de trabajo y viajes corporativos, con comodidad y profesionalismo en cada paso.",
    "Explore Services":"Explorar servicios","Reliable":"Confiable","Professional":"Profesional","24/7 transportation Service":"Servicio de transporte 24/7",
    "VIDEO AD":"ANUNCIO DE VIDEO","Your Video Here":"Tu video aquí","EXPLORE ATTRACT":"DESCUBRE ATTRACT",
    "Transport for":"Transporte para","every journey.":"cada viaje.",
    "From airport transfers to group and corporate crew transportation, discover how Attract can help with your next trip.":"Desde traslados al aeropuerto hasta transporte de grupos y personal corporativo, descubre cómo Attract puede ayudarte en tu próximo viaje.",
    "See our airport shuttle, group transportation and corporate crew services.":"Consulta nuestros servicios de transporte al aeropuerto, grupos y personal corporativo.",
    "View services":"Ver servicios","Explore our buses and the capacity and comfort options available.":"Explora nuestros autobuses y las opciones de capacidad y comodidad disponibles.",
    "View fleet":"Ver flota","Book a Ride":"Reservar un viaje","Tell us your route, date and group size and request transportation.":"Indícanos tu ruta, fecha y número de pasajeros para solicitar transporte.",
    "WHY WE'RE RELIABLE":"POR QUÉ SOMOS CONFIABLES","Reliable transport for":"Transporte confiable para",
    "We’re built for dependable service, with dependable planning, smooth travel and a team that cares about your destination.":"Estamos preparados para ofrecer un servicio confiable, con buena planificación, viajes tranquilos y un equipo que se preocupa por tu destino.",
    "Always on Time":"Siempre a tiempo","Our dispatch and planning help keep schedules moving and pickups ready when you need us.":"Nuestra planificación ayuda a mantener los horarios y las recogidas listas cuando las necesitas.",
    "Safe Travel":"Viajes seguros","We focus on responsible service, careful route planning and passenger-first transportation.":"Nos enfocamos en un servicio responsable, una planificación cuidadosa de rutas y el bienestar de los pasajeros.",
    "Comfortable Rides":"Viajes cómodos","Our transportation is arranged to support a smooth, clean and comfortable experience.":"Nuestro transporte está preparado para ofrecer una experiencia fluida, limpia y cómoda.",
    "Professional Drivers":"Conductores profesionales","Our drivers support every trip with professionalism, courtesy and a commitment to service.":"Nuestros conductores realizan cada viaje con profesionalismo, cortesía y compromiso con el servicio.",
    "READY TO MOVE?":"¿LISTO PARA VIAJAR?","Let's get your":"Comencemos tu","journey started.":"viaje.",
    "Need transportation in Suriname? Contact Attract and tell us what you need.":"¿Necesitas transporte en Surinam? Contacta a Attract y cuéntanos qué necesitas.",
    "WhatsApp Us":"Escríbenos por WhatsApp","Airport shuttle, group transportation and corporate crew transport in Suriname.":"Transporte al aeropuerto, grupos y personal corporativo en Surinam.",
    "Fleet":"Flota","TikTok":"TikTok","Facebook":"Facebook","Email":"Correo electrónico","Attract Transportation Services. All rights reserved.":"Attract Transportation Services. Todos los derechos reservados.",
    "WHAT WE DO":"LO QUE HACEMOS","Transportation built":"Transporte diseñado","around your trip.":"para tu viaje.",
    "Whether you're arriving in Suriname, traveling with a group, or moving corporate crew, Attract keeps the journey simple.":"Ya sea que llegues a Surinam, viajes en grupo o transportes personal corporativo, Attract mantiene el viaje sencillo.",
    "Airport Shuttle":"Transporte al aeropuerto","Comfortable transportation to and from Zanderij Airport, with easy booking and dependable pickup and drop-off service.":"Transporte cómodo desde y hacia el Aeropuerto de Zanderij, con reservas sencillas y recogida y entrega confiables.",
    "24/7 transportation • always on time":"Transporte 24/7 • siempre a tiempo","Book airport transport":"Reservar transporte al aeropuerto",
    "Group Transport":"Transporte de grupos","Transportation for tourist groups, private groups, schools, events and other organized trips.":"Transporte para grupos turísticos, grupos privados, escuelas, eventos y otros viajes organizados.",
    "Request a quote":"Solicitar cotización","Corporate Transport Services":"Servicios de transporte corporativo",
    "Professional and reliable transportation solutions for businesses, employees, meetings, events, and corporate travel.":"Soluciones de transporte profesionales y confiables para empresas, empleados, reuniones, eventos y viajes corporativos.",
    "Talk to us":"Habla con nosotros","One-Time Transportation":"Transporte de un solo viaje",
    "Need transportation for a specific trip or occasion? You can easily book your transportation directly through our website.":"¿Necesitas transporte para un viaje u ocasión específica? Puedes reservarlo fácilmente directamente desde nuestro sitio web.",
    "Perfect for:":"Ideal para:","Airport shuttles":"Traslados al aeropuerto","Groups needing transportation":"Grupos que necesitan transporte","Companies hosting events":"Empresas que organizan eventos","One-time group trips":"Viajes grupales puntuales","Book Now":"Reservar ahora",
    "Daily & Recurring Transportation":"Transporte diario y recurrente","Need transportation on a daily or regular basis? Contact us by email so we can discuss your requirements and create a transportation arrangement that works for you.":"¿Necesitas transporte diario o regular? Contáctanos por correo para hablar de tus necesidades y crear un servicio que funcione para ti.",
    "Staff transportation to and from the office":"Transporte del personal hacia y desde la oficina","Daily employee transportation":"Transporte diario de empleados","Transportation to and from a workplace":"Transporte hacia y desde el lugar de trabajo","Regular school transportation":"Transporte escolar regular","Long-term transportation arrangements":"Acuerdos de transporte a largo plazo","Contact Us":"Contáctanos",
    "WHAT'S INCLUDED":"QUÉ INCLUIMOS","What’s included":"Qué incluye","on every trip.":"cada viaje.",
    "Professional driver support":"Conductores profesionales","Experienced, courteous drivers who help keep your trip smooth and organized.":"Conductores experimentados y atentos que ayudan a mantener tu viaje fluido y organizado.",
    "Pickup and drop-off planning":"Planificación de recogidas y entregas","Clear travel coordination for arriving, departing and scheduled transportation needs.":"Coordinación clara para llegadas, salidas y necesidades de transporte programadas.",
    "Comfortable transportation":"Transporte cómodo","Reliable vehicles arranged for a safe, comfortable and productive journey.":"Vehículos confiables preparados para un viaje seguro, cómodo y productivo.",
    "Responsive route assistance":"Asistencia de rutas","Help with transport timing, routing and communication before and during your trip.":"Ayuda con horarios, rutas y comunicación antes y durante tu viaje.",
    "Clean, maintained buses":"Autobuses limpios y mantenidos","Every trip is supported by buses that are cleaned, maintained and ready for service.":"Cada viaje cuenta con autobuses limpios, mantenidos y listos para el servicio.",
    "Always air-conditioned":"Siempre con aire acondicionado","Our fleet is organized to keep passengers comfortable with reliable air-conditioned travel.":"Nuestra flota está preparada para mantener a los pasajeros cómodos con transporte climatizado.",
    "NEED CUSTOM TRANSPORT?":"¿NECESITAS TRANSPORTE PERSONALIZADO?","Let's plan your":"Planifiquemos tu","next trip.":"próximo viaje.","Tell us your group size, route and schedule and we'll help arrange the right transportation.":"Indícanos el tamaño del grupo, la ruta y el horario y te ayudaremos a organizar el transporte adecuado.",
    "THE ATTRACT FLEET":"LA FLOTA ATTRACT","Comfort on":"Comodidad en","every route.":"cada ruta.",
    "Our fleet is built for comfortable group transportation, with air conditioning and reclining seating on selected vehicles.":"Nuestra flota está preparada para transporte grupal cómodo, con aire acondicionado y asientos reclinables en vehículos seleccionados.",
    "Max passengers":"Máximo de pasajeros","Air-conditioned":"Con aire acondicionado","vehicles":"vehículos",
    "*Capacity depends on vehicle configuration and luggage requirements.":"*La capacidad depende de la configuración del vehículo y las necesidades de equipaje.",
    "FLEET OPTIONS":"OPCIONES DE FLOTA","Built for":"Diseñado para","your group.":"tu grupo.",
    "Capacity":"Capacidad","10–25 passengers":"10–25 pasajeros","Airport Shuttle Coasters":"Coasters para aeropuerto",
    "Our special airport buses can accommodate up to 25 passengers and are designed with extra-large luggage space, making them ideal for airport transfers and groups traveling with large amounts of baggage.":"Nuestros autobuses especiales para aeropuerto pueden llevar hasta 25 pasajeros y cuentan con espacio extra grande para equipaje, ideales para traslados al aeropuerto y grupos con mucho equipaje.",
    "Please note: These buses are available for extra-luggage trips. Route availability may be limited.":"Nota: Estos autobuses están disponibles para viajes con equipaje adicional. La disponibilidad de rutas puede ser limitada.",
    "Clean & well-maintained buses":"Autobuses limpios y bien mantenidos","Drink coolers":"Neveras para bebidas","Sun-blocking curtains":"Cortinas para bloquear el sol","Extra-large luggage space":"Espacio extra grande para equipaje",
    "10–29 passengers":"10–29 pasajeros","Toyota Coasters":"Toyota Coasters",
    "We offer different Toyota Coaster options to match your needs, from Super Lounges with large reclining seats to models with easy-access rear doors for larger carry-on item":"Ofrecemos diferentes Toyota Coaster según tus necesidades, desde Super Lounges con grandes asientos reclinables hasta modelos con puertas traseras de fácil acceso para equipaje de mano grande.",
    "Features vary by bus and passenger count. For maximum comfort, we recommend 20–25 passengers. At 30 passengers, foldable seats may be required and some comfort features, such as a cooler, may not be available.":"Las características varían según el autobús y el número de pasajeros. Para máxima comodidad recomendamos 20–25 pasajeros. Con 30 pasajeros pueden necesitarse asientos plegables y algunas comodidades, como una nevera, podrían no estar disponibles.",
    "For the best experience, request our Super Lounge, with a maximum capacity of 20 passengers.":"Para la mejor experiencia, solicita nuestro Super Lounge, con capacidad máxima de 20 pasajeros.",
    "Comfortable seating":"Asientos cómodos","5-15 passengers":"5–15 pasajeros","Hiace":"HiAce",
    "Our HiAce buses are ideal for smaller groups, quick pickups, and both short and long-distance trips. They can accommodate up to 15 passengers and are a great choice when you need a compact and convenient transportation option.":"Nuestros HiAce son ideales para grupos pequeños, recogidas rápidas y viajes cortos o largos. Pueden llevar hasta 15 pasajeros y son una opción compacta y conveniente.",
    "For the best comfort and luggage space, we recommend around 10 passengers or fewer, leaving plenty of room for luggage, bags, and other items.":"Para mayor comodidad y espacio para equipaje, recomendamos alrededor de 10 pasajeros o menos, dejando bastante espacio para maletas, bolsos y otros artículos.",
    "Small group travel":"Viajes para grupos pequeños","10–20 passengers":"10–20 pasajeros","4 Wheel Drive":"4x4",
    "Our 4WD Mitsubishi Rosa buses are built to take you where regular buses can’t. Designed for rough terrain and remote destinations, they’re ideal for off-road adventures and challenging routes such as Brownsberg.":"Nuestros Mitsubishi Rosa 4WD están preparados para llevarte donde los autobuses normales no pueden. Diseñados para terrenos difíciles y destinos remotos, son ideales para aventuras todoterreno y rutas como Brownsberg.",
    "Please note: These buses do not have air conditioning.":"Nota: Estos autobuses no tienen aire acondicionado.","Remote route access":"Acceso a rutas remotas","professional drivers":"conductores profesionales",
    "ABOUT ATTRACT":"SOBRE ATTRACT","Reliable transport.":"Transporte confiable.","Built around you.":"Pensado para ti.",
    "Attract Transportation provides dependable bus transportation for individuals, groups, businesses and organizations. We offer different transportation options to match your group, route and travel needs.":"Attract Transportation ofrece transporte confiable en autobús para personas, grupos, empresas y organizaciones. Contamos con diferentes opciones según tu grupo, ruta y necesidades de viaje.",
    "OUR STORY":"NUESTRA HISTORIA","Moving people":"Movemos personas","with purpose.":"con propósito.",
    "Attract Transportation is focused on making group transportation simple, dependable and comfortable. From one-time trips to regular transportation arrangements, we work around what each customer needs.":"Attract Transportation se enfoca en hacer que el transporte grupal sea sencillo, confiable y cómodo. Desde viajes puntuales hasta servicios regulares, trabajamos según las necesidades de cada cliente.",
    "Our fleet gives customers different options for group size, luggage, comfort and destination — helping you choose the right bus for the journey ahead.":"Nuestra flota ofrece opciones según el tamaño del grupo, equipaje, comodidad y destino, ayudándote a elegir el autobús adecuado.",
    "YOUR TRIP.":"TU VIAJE.","OUR RESPONSIBILITY.":"NUESTRA RESPONSABILIDAD.","OUR MISSION":"NUESTRA MISIÓN",
    "Make every journey":"Haz que cada viaje","smooth and dependable.":"sea fluido y confiable.",
    "Our mission is to provide safe, reliable and comfortable transportation while making every journey as smooth as possible for our customers.":"Nuestra misión es ofrecer transporte seguro, confiable y cómodo, haciendo que cada viaje sea lo más fluido posible para nuestros clientes.",
    "WHAT WE VALUE":"LO QUE VALORAMOS","What matters":"Lo que importa","to us.":"para nosotros.",
    "The way we operate is built around the things that matter most when you trust someone with your transportation.":"Nuestra forma de trabajar se basa en lo que más importa cuando confías tu transporte a alguien.",
    "We value your time and aim to provide dependable transportation for every trip.":"Valoramos tu tiempo y buscamos ofrecer transporte confiable en cada viaje.",
    "Safety":"Seguridad","Passenger safety comes first throughout every journey.":"La seguridad de los pasajeros es lo primero en cada viaje.",
    "Comfort":"Comodidad","We offer different bus options so you can choose the comfort level that fits your trip.":"Ofrecemos diferentes autobuses para que elijas el nivel de comodidad que mejor se adapte a tu viaje.",
    "Customer Service":"Atención al cliente","We aim to keep communication clear and make arranging transportation simple.":"Buscamos mantener una comunicación clara y hacer que organizar el transporte sea sencillo.",
    "OUR COMMITMENT":"NUESTRO COMPROMISO","READY":"LISTO","TO RIDE":"PARA VIAJAR","More than":"Más que","just a bus.":"solo un autobús.",
    "We work to keep our buses clean, maintained and ready for the road. We also provide different vehicle options so customers can choose what best fits their passenger count, luggage and destination.":"Trabajamos para mantener nuestros autobuses limpios, mantenidos y listos para la carretera. También ofrecemos diferentes vehículos para que elijas según pasajeros, equipaje y destino.",
    "Clean and well-maintained buses":"Autobuses limpios y bien mantenidos","Comfort-focused transportation options":"Opciones de transporte enfocadas en la comodidad","Different buses for different group sizes":"Diferentes autobuses para distintos tamaños de grupo","Options for regular and one-time transportation":"Opciones para transporte regular y puntual",
    "AT A GLANCE":"DE UN VISTAZO","Transportation":"Transporte","that fits.":"que se adapta.",
    "One-Time Trips":"Viajes puntuales","Book online for individual trips and occasions.":"Reserva en línea para viajes individuales y ocasiones especiales.",
    "Recurring Service":"Servicio recurrente","Email us for daily or long-term transportation.":"Escríbenos para transporte diario o a largo plazo.",
    "Multiple Bus Types":"Varios tipos de autobús","Options for different passenger counts and travel needs.":"Opciones para diferentes cantidades de pasajeros y necesidades de viaje.",
    "Different Destinations":"Diferentes destinos","From city trips to specialized off-road routes.":"Desde viajes urbanos hasta rutas todoterreno especializadas.",
    "FLEET PREVIEW":"VISTA PREVIA DE LA FLOTA","OUR FLEET":"NUESTRA FLOTA","04 OPTIONS":"04 OPCIONES","BUS":"AUTOBÚS","COASTER":"COASTER","HIACE":"HIACE","4WD ROSA":"ROSA 4WD",
    "The right bus":"El autobús adecuado","for the trip.":"para el viaje.",
    "From comfortable Toyota Coasters and HiAce buses to specialized Mitsubishi Rosa 4WD buses, our fleet gives you options for different group sizes, luggage requirements, comfort levels and destinations.":"Desde Toyota Coasters y HiAce cómodos hasta Mitsubishi Rosa 4WD especializados, nuestra flota ofrece opciones para diferentes grupos, equipaje, niveles de comodidad y destinos.",
    "Explore Our Fleet":"Explorar nuestra flota","READY TO TRAVEL?":"¿LISTO PARA VIAJAR?","where you need to be.":"donde necesitas estar.",
    "Whether you need transportation for one trip or a regular service, we're here to help.":"Ya sea que necesites transporte para un viaje o un servicio regular, estamos aquí para ayudarte.",
    "Book a Trip":"Reservar un viaje","Contact Us":"Contáctanos",
    "CONTACT ATTRACT":"CONTACTA A ATTRACT","Let's get your":"Comencemos tu","journey started.":"viaje.",
    "Tell us where you're going, when you need transportation and how many passengers you're traveling with.":"Dinos adónde vas, cuándo necesitas transporte y cuántos pasajeros viajarán.",
    "GET IN TOUCH":"PONTE EN CONTACTO","We're here to":"Estamos aquí para","help.":"ayudarte.","Location":"Ubicación","Suriname":"Surinam","Serving customers throughout Suriname.":"Atendemos a clientes en todo Surinam.",
    "Email Us":"Envíanos un correo","Phone":"Teléfono","Call Us":"Llámanos","Social Media":"Redes sociales","Follow Us":"Síguenos",
    "OUR LOCATION":"NUESTRA UBICACIÓN","Paramaribo, Suriname · Click for directions":"Paramaribo, Surinam · Haz clic para obtener indicaciones",
    "ONE-TIME TRANSPORTATION":"TRANSPORTE DE UN SOLO VIAJE","Need a ride for one trip?":"¿Necesitas transporte para un solo viaje?",
    "Book online for airport shuttles, group transportation, company events and other one-time trips.":"Reserva en línea para traslados al aeropuerto, grupos, eventos de empresa y otros viajes puntuales.",
    "DAILY & RECURRING TRANSPORTATION":"TRANSPORTE DIARIO Y RECURRENTE","Need regular transportation?":"¿Necesitas transporte regular?",
    "For staff transportation, daily office trips or other recurring services, contact us by email to discuss your requirements.":"Para transporte de personal, viajes diarios a la oficina u otros servicios recurrentes, contáctanos por correo para hablar de tus necesidades."
  },
  nl: {
    "Home":"Home","Services":"Diensten","Our Fleet":"Onze vloot","About":"Over ons","Contact":"Contact","BookMyRide":"Boek je rit",
    "TRANSPORTATION • SURINAME":"TRANSPORT • SURINAME","YOUR JOURNEY.":"JOUW REIS.","OUR PRIORITY.":"ONZE PRIORITEIT.",
    "Reliable":"Betrouwbaar","Professional":"Professioneel","24/7 transportation Service":"24/7 vervoersservice",
    "Explore Services":"Bekijk diensten","EXPLORE ATTRACT":"ONTDEK ATTRACT","Transport for":"Transport voor","every journey.":"elke reis.",
    "View services":"Bekijk diensten","View fleet":"Bekijk vloot","Book a Ride":"Boek een rit","WHY WE'RE RELIABLE":"WAAROM WIJ BETROUWBAAR ZIJN",
    "Always on Time":"Altijd op tijd","Safe Travel":"Veilig reizen","Comfortable Rides":"Comfortabele ritten","Professional Drivers":"Professionele chauffeurs",
    "READY TO MOVE?":"KLAAR OM TE GAAN?","Let's get your":"Laten we je","journey started.":"reis beginnen.","WhatsApp Us":"WhatsApp ons",
    "Airport shuttle, group transportation and corporate crew transport in Suriname.":"Luchthavenvervoer, groepsvervoer en zakelijk personeelsvervoer in Suriname.",
    "Fleet":"Vloot","Email":"E-mail","WHAT WE DO":"WAT WE DOEN","Transportation built":"Transport gebouwd","around your trip.":"rond jouw reis.",
    "Airport Shuttle":"Luchthavenvervoer","Group Transport":"Groepsvervoer","Corporate Transport Services":"Zakelijke vervoersdiensten",
    "One-Time Transportation":"Eenmalig vervoer","Daily & Recurring Transportation":"Dagelijks & terugkerend vervoer","Perfect for:":"Ideaal voor:",
    "Book Now":"Nu boeken","Contact Us":"Neem contact op","WHAT'S INCLUDED":"WAT IS INBEGREPEN","What’s included":"Wat is inbegrepen","on every trip.":"bij elke rit.",
    "Professional driver support":"Professionele chauffeurs","Pickup and drop-off planning":"Planning voor ophalen en afzetten","Comfortable transportation":"Comfortabel vervoer",
    "Responsive route assistance":"Hulp bij routeplanning","Clean, maintained buses":"Schone, onderhouden bussen","Always air-conditioned":"Altijd voorzien van airconditioning",
    "NEED CUSTOM TRANSPORT?":"MAATWERKVERVOER NODIG?","Let's plan your":"Laten we je","next trip.":"volgende reis plannen.",
    "THE ATTRACT FLEET":"DE ATTRACT-VLOOT","Comfort on":"Comfort op","every route.":"elke route.","Max passengers":"Max. passagiers",
    "Air-conditioned":"Airconditioning","vehicles":"voertuigen","FLEET OPTIONS":"VLOOTOPTIES","Built for":"Gebouwd voor","your group.":"jouw groep.",
    "Capacity":"Capaciteit","Airport Shuttle Coasters":"Airport Shuttle Coasters","Toyota Coasters":"Toyota Coasters","Hiace":"HiAce","4 Wheel Drive":"4x4",
    "Comfortable seating":"Comfortabele stoelen","Small group travel":"Reizen met kleine groepen","Remote route access":"Toegang tot afgelegen routes",
    "ABOUT ATTRACT":"OVER ATTRACT","Reliable transport.":"Betrouwbaar vervoer.","Built around you.":"Afgestemd op jou.",
    "OUR STORY":"ONS VERHAAL","Moving people":"Mensen verplaatsen","with purpose.":"met een doel.","YOUR TRIP.":"JOUW REIS.","OUR RESPONSIBILITY.":"ONZE VERANTWOORDELIJKHEID.",
    "OUR MISSION":"ONZE MISSIE","Make every journey":"Maak elke reis","smooth and dependable.":"soepel en betrouwbaar.","WHAT WE VALUE":"WAT WIJ BELANGRIJK VINDEN",
    "What matters":"Wat belangrijk is","to us.":"voor ons.","Safety":"Veiligheid","Comfort":"Comfort","Customer Service":"Klantenservice","OUR COMMITMENT":"ONZE TOEZEGGING",
    "More than":"Meer dan","just a bus.":"alleen een bus.","AT A GLANCE":"IN HET KORT","Transportation":"Vervoer","that fits.":"dat past.",
    "One-Time Trips":"Eenmalige ritten","Recurring Service":"Terugkerende service","Multiple Bus Types":"Meerdere bustypes","Different Destinations":"Verschillende bestemmingen",
    "FLEET PREVIEW":"VLOOTOVERZICHT","OUR FLEET":"ONZE VLOOT","04 OPTIONS":"04 OPTIES","BUS":"BUS","The right bus":"De juiste bus","for the trip.":"voor de reis.",
    "Explore Our Fleet":"Bekijk onze vloot","READY TO TRAVEL?":"KLAAR OM TE REIZEN?","where you need to be.":"waar je moet zijn.",
    "Book a Trip":"Boek een rit","CONTACT ATTRACT":"CONTACT ATTRACT","GET IN TOUCH":"NEEM CONTACT OP","We're here to":"We zijn er om","help.":"te helpen.",
    "Location":"Locatie","Suriname":"Suriname","Email Us":"E-mail ons","Phone":"Telefoon","Call Us":"Bel ons","Social Media":"Sociale media","Follow Us":"Volg ons",
    "OUR LOCATION":"ONZE LOCATIE","Paramaribo, Suriname · Click for directions":"Paramaribo, Suriname · Klik voor routebeschrijving",
    "ONE-TIME TRANSPORTATION":"EENMALIG VERVOER","Need a ride for one trip?":"Vervoer nodig voor één rit?","DAILY & RECURRING TRANSPORTATION":"DAGELIJKS & TERUGKEREND VERVOER",
    "Need regular transportation?":"Regelmatig vervoer nodig?"
  },
  fr: {
    "Home":"Accueil","Services":"Services","Our Fleet":"Notre flotte","About":"À propos","Contact":"Contact","BookMyRide":"Réserver",
    "TRANSPORTATION • SURINAME":"TRANSPORT • SURINAME","YOUR JOURNEY.":"VOTRE VOYAGE.","OUR PRIORITY.":"NOTRE PRIORITÉ.",
    "Explore Services":"Voir les services","Reliable":"Fiable","Professional":"Professionnel","24/7 transportation Service":"Service de transport 24/7",
    "EXPLORE ATTRACT":"DÉCOUVREZ ATTRACT","Transport for":"Transport pour","every journey.":"chaque voyage.","View services":"Voir les services","View fleet":"Voir la flotte",
    "Book a Ride":"Réserver un trajet","WHY WE'RE RELIABLE":"POURQUOI NOUS SOMMES FIABLES","Always on Time":"Toujours à l'heure","Safe Travel":"Voyage sûr",
    "Comfortable Rides":"Trajets confortables","Professional Drivers":"Chauffeurs professionnels","READY TO MOVE?":"PRÊT À PARTIR ?",
    "Let's get your":"Commençons votre","journey started.":"voyage.","WhatsApp Us":"WhatsApp","Fleet":"Flotte","Email":"E-mail",
    "WHAT WE DO":"CE QUE NOUS FAISONS","Transportation built":"Un transport conçu","around your trip.":"autour de votre voyage.",
    "Airport Shuttle":"Navette aéroport","Group Transport":"Transport de groupes","Corporate Transport Services":"Transport d'entreprise",
    "One-Time Transportation":"Transport ponctuel","Daily & Recurring Transportation":"Transport quotidien et récurrent","Perfect for:":"Idéal pour :","Book Now":"Réserver maintenant",
    "Contact Us":"Nous contacter","WHAT'S INCLUDED":"CE QUI EST INCLUS","What’s included":"Ce qui est inclus","on every trip.":"à chaque voyage.",
    "Professional driver support":"Chauffeurs professionnels","Pickup and drop-off planning":"Planification des prises en charge","Comfortable transportation":"Transport confortable",
    "Responsive route assistance":"Assistance pour les itinéraires","Clean, maintained buses":"Bus propres et entretenus","Always air-conditioned":"Toujours climatisé",
    "NEED CUSTOM TRANSPORT?":"BESOIN D'UN TRANSPORT SUR MESURE ?","Let's plan your":"Planifions votre","next trip.":"prochain voyage.",
    "THE ATTRACT FLEET":"LA FLOTTE ATTRACT","Comfort on":"Confort sur","every route.":"chaque trajet.","Max passengers":"Passagers max.",
    "Air-conditioned":"Climatisé","vehicles":"véhicules","FLEET OPTIONS":"OPTIONS DE FLOTTE","Built for":"Conçu pour","your group.":"votre groupe.",
    "Capacity":"Capacité","Airport Shuttle Coasters":"Coasters navette aéroport","Toyota Coasters":"Toyota Coasters","Hiace":"HiAce","4 Wheel Drive":"4x4",
    "Comfortable seating":"Sièges confortables","Small group travel":"Voyages en petits groupes","Remote route access":"Accès aux itinéraires isolés",
    "ABOUT ATTRACT":"À PROPOS D'ATTRACT","Reliable transport.":"Transport fiable.","Built around you.":"Pensé pour vous.",
    "OUR STORY":"NOTRE HISTOIRE","Moving people":"Transporter les personnes","with purpose.":"avec un objectif.","YOUR TRIP.":"VOTRE VOYAGE.","OUR RESPONSIBILITY.":"NOTRE RESPONSABILITÉ.",
    "OUR MISSION":"NOTRE MISSION","Make every journey":"Rendre chaque voyage","smooth and dependable.":"fluide et fiable.","WHAT WE VALUE":"NOS VALEURS",
    "What matters":"Ce qui compte","to us.":"pour nous.","Safety":"Sécurité","Comfort":"Confort","Customer Service":"Service client","OUR COMMITMENT":"NOTRE ENGAGEMENT",
    "More than":"Plus qu'","just a bus.":"un simple bus.","AT A GLANCE":"EN UN COUP D'ŒIL","Transportation":"Transport","that fits.":"adapté à vos besoins.",
    "One-Time Trips":"Voyages ponctuels","Recurring Service":"Service récurrent","Multiple Bus Types":"Plusieurs types de bus","Different Destinations":"Différentes destinations",
    "FLEET PREVIEW":"APERÇU DE LA FLOTTE","OUR FLEET":"NOTRE FLOTTE","04 OPTIONS":"04 OPTIONS","BUS":"BUS","The right bus":"Le bon bus","for the trip.":"pour le voyage.",
    "Explore Our Fleet":"Découvrir notre flotte","READY TO TRAVEL?":"PRÊT À VOYAGER ?","where you need to be.":"là où vous devez aller.",
    "Book a Trip":"Réserver un voyage","CONTACT ATTRACT":"CONTACTER ATTRACT","GET IN TOUCH":"CONTACTEZ-NOUS","We're here to":"Nous sommes là pour","help.":"vous aider.",
    "Location":"Emplacement","Suriname":"Suriname","Email Us":"Nous écrire","Phone":"Téléphone","Call Us":"Nous appeler","Social Media":"Réseaux sociaux","Follow Us":"Suivez-nous",
    "OUR LOCATION":"NOTRE EMPLACEMENT","Paramaribo, Suriname · Click for directions":"Paramaribo, Suriname · Cliquez pour l'itinéraire",
    "ONE-TIME TRANSPORTATION":"TRANSPORT PONCTUEL","Need a ride for one trip?":"Besoin d'un trajet ponctuel ?","DAILY & RECURRING TRANSPORTATION":"TRANSPORT QUOTIDIEN ET RÉCURRENT",
    "Need regular transportation?":"Besoin d'un transport régulier ?"
  },
  pt: {
    "Home":"Início","Services":"Serviços","Our Fleet":"Nossa frota","About":"Sobre nós","Contact":"Contato","BookMyRide":"Reservar viagem",
    "TRANSPORTATION • SURINAME":"TRANSPORTE • SURINAME","YOUR JOURNEY.":"SUA VIAGEM.","OUR PRIORITY.":"NOSSA PRIORIDADE.",
    "Explore Services":"Explorar serviços","Reliable":"Confiável","Professional":"Profissional","24/7 transportation Service":"Serviço de transporte 24/7",
    "EXPLORE ATTRACT":"CONHEÇA A ATTRACT","Transport for":"Transporte para","every journey.":"toda viagem.","View services":"Ver serviços","View fleet":"Ver frota",
    "Book a Ride":"Reservar viagem","WHY WE'RE RELIABLE":"POR QUE SOMOS CONFIÁVEIS","Always on Time":"Sempre pontual","Safe Travel":"Viagem segura",
    "Comfortable Rides":"Viagens confortáveis","Professional Drivers":"Motoristas profissionais","READY TO MOVE?":"PRONTO PARA IR?","Let's get your":"Vamos começar sua",
    "journey started.":"viagem.","WhatsApp Us":"Fale conosco no WhatsApp","Fleet":"Frota","Email":"E-mail",
    "WHAT WE DO":"O QUE FAZEMOS","Transportation built":"Transporte pensado","around your trip.":"para sua viagem.",
    "Airport Shuttle":"Transporte para o aeroporto","Group Transport":"Transporte de grupos","Corporate Transport Services":"Serviços de transporte corporativo",
    "One-Time Transportation":"Transporte pontual","Daily & Recurring Transportation":"Transporte diário e recorrente","Perfect for:":"Ideal para:","Book Now":"Reservar agora",
    "Contact Us":"Entre em contato","WHAT'S INCLUDED":"O QUE ESTÁ INCLUÍDO","What’s included":"O que está incluído","on every trip.":"em toda viagem.",
    "Professional driver support":"Motoristas profissionais","Pickup and drop-off planning":"Planejamento de embarque e desembarque","Comfortable transportation":"Transporte confortável",
    "Responsive route assistance":"Assistência de rota","Clean, maintained buses":"Ônibus limpos e revisados","Always air-conditioned":"Sempre com ar-condicionado",
    "NEED CUSTOM TRANSPORT?":"PRECISA DE TRANSPORTE PERSONALIZADO?","Let's plan your":"Vamos planejar sua","next trip.":"próxima viagem.",
    "THE ATTRACT FLEET":"A FROTA ATTRACT","Comfort on":"Conforto em","every route.":"todas as rotas.","Max passengers":"Máx. passageiros",
    "Air-conditioned":"Com ar-condicionado","vehicles":"veículos","FLEET OPTIONS":"OPÇÕES DE FROTA","Built for":"Feito para","your group.":"seu grupo.",
    "Capacity":"Capacidade","Airport Shuttle Coasters":"Coasters para aeroporto","Toyota Coasters":"Toyota Coasters","Hiace":"HiAce","4 Wheel Drive":"4x4",
    "Comfortable seating":"Assentos confortáveis","Small group travel":"Viagens para grupos pequenos","Remote route access":"Acesso a rotas remotas",
    "ABOUT ATTRACT":"SOBRE A ATTRACT","Reliable transport.":"Transporte confiável.","Built around you.":"Pensado para você.",
    "OUR STORY":"NOSSA HISTÓRIA","Moving people":"Movendo pessoas","with purpose.":"com propósito.","YOUR TRIP.":"SUA VIAGEM.","OUR RESPONSIBILITY.":"NOSSA RESPONSABILIDADE.",
    "OUR MISSION":"NOSSA MISSÃO","Make every journey":"Tornar cada viagem","smooth and dependable.":"tranquila e confiável.","WHAT WE VALUE":"O QUE VALORIZAMOS",
    "What matters":"O que importa","to us.":"para nós.","Safety":"Segurança","Comfort":"Conforto","Customer Service":"Atendimento ao cliente","OUR COMMITMENT":"NOSSO COMPROMISSO",
    "More than":"Mais do que","just a bus.":"apenas um ônibus.","AT A GLANCE":"EM RESUMO","Transportation":"Transporte","that fits.":"que se adapta.",
    "One-Time Trips":"Viagens pontuais","Recurring Service":"Serviço recorrente","Multiple Bus Types":"Vários tipos de ônibus","Different Destinations":"Diferentes destinos",
    "FLEET PREVIEW":"VISÃO DA FROTA","OUR FLEET":"NOSSA FROTA","04 OPTIONS":"04 OPÇÕES","BUS":"ÔNIBUS","The right bus":"O ônibus certo","for the trip.":"para a viagem.",
    "Explore Our Fleet":"Explorar nossa frota","READY TO TRAVEL?":"PRONTO PARA VIAJAR?","where you need to be.":"onde você precisa estar.",
    "Book a Trip":"Reservar uma viagem","CONTACT ATTRACT":"CONTATE A ATTRACT","GET IN TOUCH":"FALE CONOSCO","We're here to":"Estamos aqui para","help.":"ajudar.",
    "Location":"Localização","Suriname":"Suriname","Email Us":"Envie um e-mail","Phone":"Telefone","Call Us":"Ligue para nós","Social Media":"Redes sociais","Follow Us":"Siga-nos",
    "OUR LOCATION":"NOSSA LOCALIZAÇÃO","Paramaribo, Suriname · Click for directions":"Paramaribo, Suriname · Clique para obter direções",
    "ONE-TIME TRANSPORTATION":"TRANSPORTE PONTUAL","Need a ride for one trip?":"Precisa de transporte para uma viagem?","DAILY & RECURRING TRANSPORTATION":"TRANSPORTE DIÁRIO E RECORRENTE",
    "Need regular transportation?":"Precisa de transporte regular?"
  }
};

const languageNames = {
  en: "English",
  es: "Español",
  nl: "Nederlands",
  fr: "Français",
  pt: "Português"
};

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function translatePage(lang) {
  const dict = translations[lang] || {};
  document.documentElement.lang = lang;

  document.querySelectorAll("body *").forEach(el => {
    if (el.children.length === 0 && el.childNodes.length === 1) {
      const node = el.firstChild;
      if (node.nodeType === Node.TEXT_NODE) {
        const original = normalizeText(node.nodeValue);
        if (dict[original]) node.nodeValue = node.nodeValue.replace(original, dict[original]);
      }
    }
  });

  // Handle text nodes inside elements that also contain nested elements.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT","STYLE"].includes(parent.tagName)) return;
    const original = normalizeText(node.nodeValue);
    if (dict[original]) node.nodeValue = node.nodeValue.replace(original, dict[original]);
  });

  // A few page-level metadata strings.
  const page = location.pathname.split("/").pop() || "index.html";
  const titles = {
    en: {
      "index.html":"Attract Transportation | Suriname","services.html":"Services | Attract Transportation",
      "fleet.html":"Our Fleet | Attract Transportation","about.html":"About | Attract Transportation",
      "contact.html":"Contact | Attract Transportation","bookmyride.html":"Boek je rit | Attract Transportation","bookmyride.html":"BookMyRide | Attract Transportation"
    },
    es: {"index.html":"Attract Transportation | Surinam","services.html":"Servicios | Attract Transportation","fleet.html":"Nuestra Flota | Attract Transportation","about.html":"Sobre nosotros | Attract Transportation","contact.html":"Contacto | Attract Transportation","bookmyride.html":"Reservar | Attract Transportation"},
    nl: {"index.html":"Attract Transportation | Suriname","services.html":"Diensten | Attract Transportation","fleet.html":"Onze vloot | Attract Transportation","about.html":"Over ons | Attract Transportation","contact.html":"Contact | Attract Transportation","bookmyride.html":"BookMyRide | Attract Transportation"},
    fr: {"index.html":"Attract Transportation | Suriname","services.html":"Services | Attract Transportation","fleet.html":"Notre flotte | Attract Transportation","about.html":"À propos | Attract Transportation","contact.html":"Contact | Attract Transportation","bookmyride.html":"BookMyRide | Attract Transportation"},
    pt: {"index.html":"Attract Transportation | Suriname","services.html":"Serviços | Attract Transportation","fleet.html":"Nossa frota | Attract Transportation","about.html":"Sobre nós | Attract Transportation","contact.html":"Contato | Attract Transportation"}
  };
  document.title = (titles[lang] && titles[lang][page]) || document.title;
}

function addLanguageSwitcher() {
  const header = document.getElementById("header");
  if (!header || document.getElementById("languageSwitcher")) return;

  const wrap = document.createElement("div");
  wrap.className = "language-switcher";
  wrap.id = "languageSwitcher";

  const select = document.createElement("select");
  select.id = "languageSelect";
  select.setAttribute("aria-label", "Language");
  Object.entries(languageNames).forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    select.appendChild(option);
  });

  const saved = localStorage.getItem("attract-language") || "en";
  select.value = saved;

  select.addEventListener("change", () => {
    localStorage.setItem("attract-language", select.value);
    location.reload();
  });

  wrap.appendChild(select);
  const nav = header.querySelector(".nav");
  if (nav) nav.appendChild(wrap);
}

addLanguageSwitcher();

const savedLanguage = localStorage.getItem("attract-language") || "en";
if (savedLanguage !== "en") {
  // The page reloads after selection, so English is the source state.
  translatePage(savedLanguage);
}

/* BookMyRide page labels */
if (typeof translations !== "undefined") {
  Object.assign(translations.es, {
    "BOOKMYRIDE":"RESERVAR","Book your":"Reserva tu","ride.":"viaje.","ONE-TIME TRANSPORTATION":"TRANSPORTE DE UN SOLO VIAJE",
    "Let's plan":"Planifiquemos","your trip.":"tu viaje.","RIDE REQUEST":"SOLICITUD DE VIAJE","Request transportation":"Solicitar transporte",
    "Full Name":"Nombre completo","Phone / WhatsApp":"Teléfono / WhatsApp","Number of Passengers":"Número de pasajeros",
    "Pickup Location":"Lugar de recogida","Destination":"Destino","Date":"Fecha","Pickup Time":"Hora de recogida","Trip Type":"Tipo de viaje",
    "Additional Details":"Detalles adicionales","Submit Ride Request":"Enviar solicitud","DAILY & RECURRING TRANSPORTATION":"TRANSPORTE DIARIO Y RECURRENTE",
    "Need transportation every day?":"¿Necesitas transporte todos los días?","Email Us":"Envíanos un correo"
  });
  Object.assign(translations.nl, {
    "BOOKMYRIDE":"BOEK JE RIT","Book your":"Boek je","ride.":"rit.","RIDE REQUEST":"RITAANVRAAG","Request transportation":"Vervoer aanvragen",
    "Full Name":"Volledige naam","Phone / WhatsApp":"Telefoon / WhatsApp","Number of Passengers":"Aantal passagiers","Pickup Location":"Ophaallocatie",
    "Destination":"Bestemming","Date":"Datum","Pickup Time":"Ophaaltijd","Trip Type":"Type rit","Additional Details":"Extra details",
    "Submit Ride Request":"Ritaanvraag versturen","Need transportation every day?":"Dagelijks vervoer nodig?","Email Us":"E-mail ons"
  });
  Object.assign(translations.fr, {
    "BOOKMYRIDE":"RÉSERVER","Book your":"Réservez votre","ride.":"trajet.","RIDE REQUEST":"DEMANDE DE TRAJET","Request transportation":"Demander un transport",
    "Full Name":"Nom complet","Phone / WhatsApp":"Téléphone / WhatsApp","Number of Passengers":"Nombre de passagers","Pickup Location":"Lieu de prise en charge",
    "Destination":"Destination","Date":"Date","Pickup Time":"Heure de prise en charge","Trip Type":"Type de trajet","Additional Details":"Détails supplémentaires",
    "Submit Ride Request":"Envoyer la demande","Need transportation every day?":"Besoin d'un transport quotidien ?","Email Us":"Nous écrire"
  });
  Object.assign(translations.pt, {
    "BOOKMYRIDE":"RESERVAR","Book your":"Reserve sua","ride.":"viagem.","RIDE REQUEST":"SOLICITAÇÃO DE VIAGEM","Request transportation":"Solicitar transporte",
    "Full Name":"Nome completo","Phone / WhatsApp":"Telefone / WhatsApp","Number of Passengers":"Número de passageiros","Pickup Location":"Local de embarque",
    "Destination":"Destino","Date":"Data","Pickup Time":"Horário de embarque","Trip Type":"Tipo de viagem","Additional Details":"Detalhes adicionais",
    "Submit Ride Request":"Enviar solicitação","Need transportation every day?":"Precisa de transporte diário?","Email Us":"Enviar e-mail"
  });
}
