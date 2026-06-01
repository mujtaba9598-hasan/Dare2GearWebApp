// Dare2Gear — "places worth seeing" for every origin city in the planner.
// Researched from the web. Surfaced on /cities and /cities/[id].
// A future admin panel can edit these; photos can be added per place later.

export type CityPlaceCategory =
  | "fort"
  | "shrine"
  | "park"
  | "lake"
  | "museum"
  | "viewpoint"
  | "bazaar"
  | "historical"
  | "religious"
  | "nature"
  | "garden"
  | "beach"
  | "town";

export interface CityPlace {
  name: string;
  note: string;
  category: CityPlaceCategory;
}

export const CITY_PLACE_LABELS: Record<CityPlaceCategory, string> = {
  fort: "Fort",
  shrine: "Shrine / tomb",
  park: "Park",
  lake: "Lake",
  museum: "Museum",
  viewpoint: "Viewpoint",
  bazaar: "Bazaar",
  historical: "Historical",
  religious: "Religious",
  nature: "Nature",
  garden: "Garden",
  beach: "Beach",
  town: "Town",
};

export const CITY_PLACES: Record<string, CityPlace[]> = {
  // --- Metros ---
  karachi: [
    { name: "Mazar-e-Quaid", note: "White-marble mausoleum of Pakistan's founder Muhammad Ali Jinnah.", category: "historical" },
    { name: "Clifton Beach", note: "Popular Arabian Sea beach with camel rides and seaside stalls.", category: "nature" },
    { name: "Masjid e Tooba", note: "Claimed world's largest single-dome mosque, built 1969.", category: "religious" },
    { name: "Frere Hall", note: "Colonial-era 1865 building now housing a library and gallery.", category: "historical" },
    { name: "National Museum of Pakistan", note: "Wide-ranging art, relics and Indus Valley artefacts.", category: "museum" },
    { name: "Empress Market", note: "Iconic Victorian-era bazaar in Saddar for goods and spices.", category: "bazaar" },
  ],
  hyderabad: [
    { name: "Pakka Qila Fort", note: "18th-century fort built by Kalhoro ruler Ghulam Shah.", category: "fort" },
    { name: "Tombs of the Talpur Mirs", note: "Ornate tombs of Sindh's 18th-19th century Talpur rulers.", category: "shrine" },
    { name: "Sindh Museum", note: "Showcases Sindhi culture, crafts and Indus Valley history.", category: "museum" },
    { name: "Mukhi House", note: "1920s Hindu-Sindhi mansion, now a heritage museum.", category: "historical" },
    { name: "Rani Bagh", note: "Historic public garden and zoo, popular family spot.", category: "garden" },
    { name: "Shahi Bazaar", note: "One of Pakistan's longest bazaars for textiles and souvenirs.", category: "bazaar" },
  ],
  sukkur: [
    { name: "Sukkur Barrage", note: "1932 Lloyd Barrage, vast Indus irrigation engineering feat.", category: "historical" },
    { name: "Sadhu Bela Temple", note: "1823 Hindu temple complex on an Indus River island.", category: "religious" },
    { name: "Lansdowne Bridge", note: "1889 cantilever bridge spanning the Indus to Rohri.", category: "historical" },
    { name: "Lab-e-Mehran Park", note: "Riverside park with gardens, boating and picnic spots.", category: "park" },
    { name: "Masum Shah Minar", note: "17th-century minaret offering panoramic views of Sukkur.", category: "viewpoint" },
  ],
  lahore: [
    { name: "Lahore Fort", note: "UNESCO Mughal citadel featuring the mirrored Sheesh Mahal.", category: "fort" },
    { name: "Badshahi Mosque", note: "Grand 17th-century Mughal mosque, among world's largest.", category: "religious" },
    { name: "Shalimar Gardens", note: "UNESCO Mughal terraced garden built under Shah Jahan.", category: "garden" },
    { name: "Wazir Khan Mosque", note: "17th-century mosque famed for intricate tile frescoes.", category: "religious" },
    { name: "Minar-e-Pakistan", note: "Tower marking the 1940 Pakistan Resolution site.", category: "historical" },
    { name: "Lahore Museum", note: "Major museum with Gandhara art and the Fasting Buddha.", category: "museum" },
  ],
  faisalabad: [
    { name: "Clock Tower (Ghanta Ghar)", note: "1903 British-era tower at the hub of eight bazaars.", category: "historical" },
    { name: "Lyallpur Museum", note: "Showcases the region's history, culture and textile heritage.", category: "museum" },
    { name: "Jinnah Garden (Company Bagh)", note: "Colonial-era public garden with walking paths.", category: "garden" },
    { name: "Gatwala Wildlife Park", note: "131-acre park with wildlife, a lake and recreation.", category: "park" },
    { name: "Eight Bazaars", note: "Union Jack-patterned markets radiating from the Clock Tower.", category: "bazaar" },
  ],
  multan: [
    { name: "Tomb of Shah Rukn-e-Alam", note: "14th-century pre-Mughal mausoleum, Multan's iconic landmark.", category: "shrine" },
    { name: "Shrine of Bahauddin Zakariya", note: "13th-century Sufi shrine atop the Multan Fort mound.", category: "shrine" },
    { name: "Multan Fort (Qila Kohna)", note: "Historic fort enclosing shrines, gardens and old gates.", category: "fort" },
    { name: "Hussain Agahi Bazaar", note: "One of Multan's oldest markets for handicrafts and pottery.", category: "bazaar" },
    { name: "Delhi Gate", note: "Mughal-era gateway into Multan's walled old city.", category: "historical" },
    { name: "Multan Museum", note: "Artefacts, coins and manuscripts from various eras.", category: "museum" },
  ],
  islamabad: [
    { name: "Faisal Mosque", note: "Bedouin-tent-shaped mosque, South Asia's largest.", category: "religious" },
    { name: "Daman-e-Koh", note: "Margalla Hills viewpoint overlooking the whole city.", category: "viewpoint" },
    { name: "Pakistan Monument", note: "Petal-shaped national monument with a heritage museum.", category: "historical" },
    { name: "Margalla Hills National Park", note: "Forested hills with popular hiking trails and wildlife.", category: "nature" },
    { name: "Rawal Lake", note: "Reservoir with boating, gardens and picnic areas.", category: "lake" },
    { name: "Saidpur Village", note: "Restored Mughal-era village with eateries and temples.", category: "town" },
  ],
  rawalpindi: [
    { name: "Ayub National Park", note: "2,400-acre park with a lake, zoo and play areas.", category: "park" },
    { name: "Raja Bazaar", note: "One of Pindi's oldest, busiest markets for everything.", category: "bazaar" },
    { name: "Pakistan Army Museum", note: "Military history with weaponry and equipment displays.", category: "museum" },
    { name: "Rawalpindi Museum", note: "Artefacts and relics tracing the Potohar region's past.", category: "museum" },
    { name: "Saddar Bazaar", note: "Bustling colonial-era shopping district of the city.", category: "bazaar" },
  ],
  peshawar: [
    { name: "Bala Hisar Fort", note: "Ancient hilltop fort with 360-degree city views.", category: "fort" },
    { name: "Qissa Khwani Bazaar", note: "Historic 'storytellers' bazaar' famed for tea and trade.", category: "bazaar" },
    { name: "Mahabat Khan Mosque", note: "17th-century Mughal mosque with a white-marble facade.", category: "religious" },
    { name: "Peshawar Museum", note: "Renowned Gandhara Buddhist sculpture collection.", category: "museum" },
    { name: "Sethi Houses", note: "Ornate 19th-century merchant mansions, Central Asian style.", category: "historical" },
  ],
  quetta: [
    { name: "Hanna Lake", note: "Mountain-ringed lake 14km from the city, with boating.", category: "lake" },
    { name: "Hazarganji Chiltan National Park", note: "Park protecting the endangered Chiltan markhor goat.", category: "nature" },
    { name: "Quaid-e-Azam Residency", note: "Ziarat colonial house where Jinnah spent his final days.", category: "historical" },
    { name: "Urak Valley", note: "Scenic orchard valley with streams near Quetta.", category: "nature" },
    { name: "Quetta Archaeological Museum", note: "Regional artefacts and Balochistan cultural history.", category: "museum" },
    { name: "Askari Park", note: "Family recreation park with rides and green lawns.", category: "park" },
  ],

  // --- Punjab ---
  gujranwala: [
    { name: "Sheranwala Bagh (Company Bagh)", note: "Historic 19th-century public garden with old shady trees.", category: "garden" },
    { name: "Haveli Ranjit Singh", note: "Sikh-era mansion with frescoed interiors near Eminabad.", category: "historical" },
    { name: "Gurdwara Rori Sahib, Eminabad", note: "Sikh shrine marking Guru Nanak's stay with Bhai Lalo.", category: "religious" },
    { name: "Sheranwala Gate", note: "A surviving historic gateway of the old walled city.", category: "historical" },
    { name: "Jinnah Stadium parks", note: "Green recreational spaces popular for family outings.", category: "park" },
  ],
  sialkot: [
    { name: "Allama Iqbal Manzil", note: "Birthplace of poet Allama Iqbal, now a museum.", category: "museum" },
    { name: "Sialkot Fort", note: "Ancient hilltop fort ruins in the city centre.", category: "fort" },
    { name: "Gurdwara Beri Sahib", note: "300-year-old Sikh shrine linked to Guru Nanak.", category: "religious" },
    { name: "Marala Headworks", note: "Scenic Chenab River barrage, a picnic and fishing spot.", category: "nature" },
    { name: "Holy Trinity Cathedral", note: "Anglican cathedral consecrated in 1857.", category: "religious" },
  ],
  bahawalpur: [
    { name: "Noor Mahal", note: "Ornate 1872 Italianate palace built for the Nawab.", category: "historical" },
    { name: "Derawar Fort", note: "Massive 9th-century desert fort in the Cholistan.", category: "fort" },
    { name: "Lal Suhanra National Park", note: "Large park with desert, forest, a lake and wildlife.", category: "nature" },
    { name: "Darbar Mahal", note: "Grand royal palace built by the Bahawalpur Nawabs.", category: "historical" },
    { name: "Bahawalpur Museum", note: "Heritage building displaying regional history.", category: "museum" },
  ],
  sargodha: [
    { name: "Kirana Hills", note: "Rocky range with hiking trails outside the city.", category: "viewpoint" },
    { name: "Company Bagh", note: "One of Sargodha's oldest parks with shady trees.", category: "park" },
    { name: "Sher Shah Suri Mosque, Bhera", note: "16th-century Mughal-era mosque near Bhera.", category: "religious" },
    { name: "Jahaz Bara picnic spot", note: "Scenic picnic area amid the Kirana hill ranges.", category: "nature" },
  ],
  sahiwal: [
    { name: "Harappa Archaeological Site", note: "Ancient Indus Valley ruins southwest of the city.", category: "historical" },
    { name: "Harappa Museum", note: "Displays seals, pottery and artifacts from Harappa.", category: "museum" },
    { name: "Kanaan Park", note: "Popular recreational park with a small zoo.", category: "park" },
    { name: "Company Bagh", note: "Old public garden for walks and family picnics.", category: "garden" },
    { name: "Yadgar Monument", note: "White round memorial near the railway road.", category: "historical" },
  ],
  sheikhupura: [
    { name: "Hiran Minar", note: "Mughal minaret and tank built by Emperor Jahangir.", category: "historical" },
    { name: "Sheikhupura Fort", note: "Mughal-era fort built around 1607.", category: "fort" },
    { name: "Tomb of Waris Shah, Jandiala Sher Khan", note: "Shrine of the poet who wrote Heer Ranjha.", category: "shrine" },
    { name: "Area wetlands", note: "Serene lakes near the city for boating.", category: "lake" },
  ],
  rahimyarkhan: [
    { name: "Sadiq Garh Palace", note: "Grand 1882 Nawab palace in Dera Nawab Sahib.", category: "historical" },
    { name: "Bhong Mosque", note: "Aga Khan Award-winning mosque with intricate decoration.", category: "religious" },
    { name: "Pattan Minar", note: "Ancient brick minaret of debated origin.", category: "historical" },
    { name: "Sheikh Zayed Public Park", note: "Large green park with walking paths.", category: "park" },
    { name: "Cholistan Desert", note: "Vast scenic sand dunes near the city.", category: "nature" },
  ],
  jhang: [
    { name: "Tomb of Heer Ranjha", note: "Shrine to the legendary Punjabi folk romance.", category: "shrine" },
    { name: "Shrine of Sultan Bahu, Garh Maharaja", note: "Tomb of the 17th-century Sufi poet-saint.", category: "shrine" },
    { name: "Trimmu Barrage", note: "Chenab River barrage popular for fishing and boating.", category: "lake" },
  ],
  gujrat: [
    { name: "Shrine of Hazrat Shah Daula", note: "17th-century Sufi shrine in the city centre.", category: "shrine" },
    { name: "Gujrat Fort", note: "Mughal-era fort dating to 1596.", category: "fort" },
    { name: "Mangla Dam & Fort", note: "Major Jhelum River reservoir with a hilltop fort nearby.", category: "lake" },
    { name: "Gujrat pottery bazaar", note: "Markets famed for handcrafted pottery and ceramics.", category: "bazaar" },
  ],
  kasur: [
    { name: "Shrine of Baba Bulleh Shah", note: "Tomb of the 17th-century Sufi poet in the city centre.", category: "shrine" },
    { name: "Ganda Singh Border", note: "Wagah-style flag-lowering ceremony near the Indian border.", category: "historical" },
    { name: "Changa Manga Forest", note: "One of the world's largest man-made forests.", category: "nature" },
    { name: "Mazar of Baba Kamal Chishti", note: "Hilltop shrine with views over the countryside.", category: "shrine" },
  ],
  okara: [
    { name: "Aashiq Park", note: "Recreational park with a scenic boating lake.", category: "park" },
    { name: "Safdar Shaheed Park (Company Bagh)", note: "Largest and oldest public park in Okara.", category: "park" },
    { name: "Kharal Lake", note: "Natural lake named after hero Rai Ahmad Khan Kharal.", category: "lake" },
    { name: "Farid-ud-Din Water Park", note: "Family water park near the Okara bypass.", category: "park" },
  ],
  dgkhan: [
    { name: "Fort Munro", note: "Hill station in the Sulaiman Range, the 'Murree of the South'.", category: "viewpoint" },
    { name: "Tomb of Sakhi Sarwar", note: "Revered Sufi shrine with intricate tilework, near DG Khan.", category: "shrine" },
    { name: "Tomb of Ghazi Khan", note: "Historic tomb of the city's 18th-century founder.", category: "historical" },
    { name: "DG Khan Zoo", note: "Popular zoo with picnic areas and a lion safari.", category: "park" },
    { name: "DG Khan Museum", note: "Houses ancient coins, weaponry and sculptures.", category: "museum" },
  ],
  chiniot: [
    { name: "Omar Hayat Mahal", note: "Ornate 1920s carved-wood haveli, also called Gulzar Manzil.", category: "historical" },
    { name: "Shahi Mosque", note: "17th-century Mughal mosque built under Shah Jahan.", category: "religious" },
    { name: "Chenab River", note: "Scenic river flowing past the city, good for walks.", category: "nature" },
    { name: "Bahishti Maqbara", note: "Notable cemetery and pilgrimage site in Chiniot.", category: "shrine" },
  ],
  mianwali: [
    { name: "Namal Lake", note: "Scenic lake formed by a 1913 dam, draws migratory birds.", category: "lake" },
    { name: "Kalabagh", note: "Town of red salt-range hills beside the Indus.", category: "viewpoint" },
    { name: "Chashma Barrage", note: "Indus barrage near Kundian; a Ramsar wetland for birds.", category: "lake" },
    { name: "Thal Desert", note: "Sandy dunes offering camel rides and sunset views.", category: "nature" },
  ],
  bhakkar: [
    { name: "Mankera Fort", note: "Ruined mud fort from Baloch and Pathan rule, near Mankera.", category: "fort" },
    { name: "Thal Desert", note: "Vast dunes popular for desert safaris and sunsets.", category: "nature" },
    { name: "Darbar Shah Sulaiman", note: "Revered Sufi shrine attracting many pilgrims.", category: "shrine" },
    { name: "Indus River bank", note: "Riverside scenery along the district's western edge.", category: "nature" },
  ],
  jhelum: [
    { name: "Rohtas Fort", note: "16th-century Sher Shah Suri fortress, a UNESCO site.", category: "fort" },
    { name: "Tilla Jogian", note: "Ancient hilltop monastic ruins with panoramic views.", category: "viewpoint" },
    { name: "Mangla Dam", note: "Large dam on the Jhelum River; boating and jet-skiing.", category: "lake" },
    { name: "Rasul Barrage", note: "1968 barrage on the Jhelum River near the city.", category: "lake" },
  ],
  attock: [
    { name: "Attock Fort", note: "Akbar-era riverside fort guarding the Indus (exterior views).", category: "fort" },
    { name: "Attock Bridge", note: "Historic strategic rail bridge over the Indus River.", category: "historical" },
    { name: "Bagh Neelab", note: "Scenic spot where the Haro joins the Indus River.", category: "nature" },
    { name: "Khairabad Park", note: "Green riverside park for relaxing and picnics.", category: "park" },
  ],
  chakwal: [
    { name: "Katas Raj Temples", note: "Ancient Hindu temple complex around a sacred pond.", category: "religious" },
    { name: "Khewra Salt Mine", note: "World's second-largest salt mine, famed for pink salt.", category: "historical" },
    { name: "Kallar Kahar Lake", note: "Saltwater lake with boating, praised by Emperor Babur.", category: "lake" },
    { name: "Shrine of Sultan Bahu", note: "Sufi saint's shrine, also called Moron Wali Sarkar.", category: "shrine" },
  ],
  vehari: [
    { name: "Mailsi Siphon", note: "Early-1900s siphon and bridge over the Sutlej River.", category: "historical" },
    { name: "Sutlej River bank", note: "Riverside spots good for fishing and nature walks.", category: "nature" },
    { name: "Bagh Wali Mosque", note: "A well-known local mosque landmark in Vehari.", category: "religious" },
  ],
  khanewal: [
    { name: "Ruins of Tulamba", note: "Ancient walled town site, roughly 2,500 years old.", category: "historical" },
    { name: "Shrine of Khalid Walid", note: "Early medieval Sufi shrine near Kabirwala.", category: "shrine" },
    { name: "Sher Shah Suri Fort, Tulamba", note: "Remains of a 16th-century fort in Tulamba town.", category: "fort" },
    { name: "Khanewal Junction", note: "Historic major railway junction of Pakistan Railways.", category: "historical" },
  ],
  muzaffargarh: [
    { name: "Taunsa Barrage", note: "Indus barrage and Ramsar wetland; fishing and boating.", category: "lake" },
    { name: "Fort Kohna", note: "British-era fort offering a glimpse of local history.", category: "fort" },
    { name: "Shrine of Sheikh Sadan Shaheed", note: "Tomb of a 13th-century warrior on the Chenab bank.", category: "shrine" },
    { name: "Sher Shah Park", note: "Park near the tomb associated with Sher Shah Suri.", category: "park" },
  ],
  tobateksingh: [
    { name: "Teko Park", note: "Recreational green park within the city.", category: "park" },
    { name: "Manzoor Elahi Forest Park", note: "Forest park with playgrounds on Jhang Road.", category: "park" },
    { name: "Kamalia Wildlife Park", note: "Family park with animals and amusements near Kamalia.", category: "park" },
    { name: "Darbar-e-Qutbia", note: "One of Punjab's oldest Muslim shrines, in Sandhilianwali.", category: "shrine" },
  ],
  hafizabad: [
    { name: "Akbari Gate", note: "Mughal-era gateway, the city's emblematic monument.", category: "historical" },
    { name: "Hafizabad Museum", note: "Local museum showcasing regional heritage.", category: "museum" },
    { name: "Chenab River bank", note: "Picturesque riverside setting for picnics.", category: "nature" },
    { name: "Family Park", note: "Recreational park with playgrounds and green walkways.", category: "park" },
  ],
  mandibahauddin: [
    { name: "Qadirabad Barrage", note: "Large barrage on the Chenab River, a popular picnic spot.", category: "lake" },
    { name: "Chillianwala Battlefield", note: "Site of an 1849 Second Anglo-Sikh War battle.", category: "historical" },
    { name: "Gurdwara Chak Mai Daas", note: "Historic Sikh shrine open to visitors of all faiths.", category: "shrine" },
    { name: "Rasul Barrage", note: "Headworks on the Jhelum River, a scenic riverside setting.", category: "lake" },
    { name: "Mandi Bahauddin Bazaar", note: "Bustling market for fabrics, handicrafts and local goods.", category: "bazaar" },
  ],
  narowal: [
    { name: "Gurdwara Darbar Sahib Kartarpur", note: "Where Guru Nanak lived his final years; holiest Sikh shrine.", category: "religious" },
    { name: "Kartarpur Corridor", note: "Visa-free crossing linking Pakistan and India for pilgrims.", category: "historical" },
    { name: "Baba Guru Nanak fields", note: "Farmland Guru Nanak tilled, near the gurdwara complex.", category: "religious" },
    { name: "Shakargarh", note: "Nearby town known for scenic countryside and heritage.", category: "town" },
  ],

  // --- Sindh ---
  larkana: [
    { name: "Mohenjo-daro", note: "UNESCO Indus Valley city ruins from around 2500 BC.", category: "historical" },
    { name: "Bhutto Family Mausoleum", note: "White marble tomb at Garhi Khuda Bakhsh.", category: "shrine" },
    { name: "Jhukar-jo-Daro", note: "Archaeological mounds from a post-Indus Valley culture.", category: "historical" },
    { name: "Eid Gah Mosque", note: "Historic mosque and notable architectural landmark.", category: "religious" },
    { name: "Shahnawaz Bhutto Library", note: "Cultural venue and repository of Sindhi literature.", category: "museum" },
  ],
  nawabshah: [
    { name: "Nawabshah Clock Tower", note: "Historic landmark in the city centre.", category: "historical" },
    { name: "Chanhudaro", note: "Indus Valley site once a bead-making centre.", category: "historical" },
    { name: "Tomb of Mian Noor Muhammad Kalhora", note: "Domed Kalhora-era mausoleum near Moro.", category: "shrine" },
    { name: "Thul Mir Rukan", note: "Tall stupa-like cylindrical structure on a platform.", category: "historical" },
    { name: "Benazir Bhutto Park", note: "City park dedicated to the late prime minister.", category: "park" },
  ],
  mirpurkhas: [
    { name: "Kahu-Jo-Daro", note: "Ancient Buddhist stupa site from the 5th-6th century.", category: "historical" },
    { name: "Chittori Graveyard", note: "Talpur Mir mausoleums from the 17th-18th centuries.", category: "historical" },
    { name: "Mirpur Khas Fort", note: "18th-century fort, an iconic city landmark.", category: "fort" },
    { name: "Mango Orchards", note: "Famous Sindhri mango groves; an annual mango festival.", category: "nature" },
    { name: "Shahi Bazaar", note: "Market for Ajrak, textiles and regional handicrafts.", category: "bazaar" },
  ],
  jacobabad: [
    { name: "Victoria Clock Tower", note: "60-foot colonial tower for Queen Victoria's 1887 jubilee.", category: "historical" },
    { name: "Grave of General John Jacob", note: "Tomb of the British officer who founded the city.", category: "historical" },
    { name: "Jacobabad Bazaar", note: "Old-city market for Sindhi textiles, spices and crafts.", category: "bazaar" },
  ],
  shikarpur: [
    { name: "Dhak Bazaar", note: "Covered Mughal-era market built in the 1780s.", category: "bazaar" },
    { name: "Lakhi Dar", note: "Historic city gate; once the heart of Shikarpur.", category: "historical" },
    { name: "Shahi Bagh", note: "Historic garden, a popular green retreat in the city.", category: "garden" },
    { name: "Shrine of Faqeer Ullah Alvi", note: "Revered Sufi shrine in the old city.", category: "shrine" },
    { name: "Clock Tower", note: "Landmark clock tower in the historic urban core.", category: "historical" },
  ],
  thatta: [
    { name: "Shah Jahan Mosque", note: "1647 Mughal mosque famed for blue tilework and 93 domes.", category: "religious" },
    { name: "Makli Necropolis", note: "UNESCO site, one of the world's largest funerary grounds.", category: "historical" },
    { name: "Keenjhar Lake", note: "Large freshwater lake and bird sanctuary with boating.", category: "lake" },
    { name: "Banbhore", note: "Ancient port-city ruins near Thatta, with a small museum.", category: "historical" },
  ],
  dadu: [
    { name: "Gorakh Hill Station", note: "Kirthar Range hill station ~1,734m, snow in winter.", category: "viewpoint" },
    { name: "Manchar Lake", note: "Pakistan's largest freshwater lake; boating and birds.", category: "lake" },
    { name: "Kirthar National Park", note: "Vast park home to Sindh ibex and Indian wolf.", category: "nature" },
    { name: "Amri Mounds", note: "Pre-Indus Valley archaeological site near Dadu.", category: "historical" },
    { name: "Nai Gaj Dam", note: "Recent dam and a popular picnic and camping spot.", category: "lake" },
  ],
  khairpur: [
    { name: "Kot Diji Fort", note: "18th-century Talpur hill fort with sweeping views.", category: "fort" },
    { name: "Faiz Mahal", note: "1798 royal palace of the Khairpur dynasty.", category: "historical" },
    { name: "Shrine of Sachal Sarmast", note: "Sufi shrine of the revered Sindhi poet-saint.", category: "shrine" },
    { name: "Kot Diji ancient site", note: "Indus Valley settlement dating to about 3300 BCE.", category: "historical" },
    { name: "Mehrano Wildlife Sanctuary", note: "Talpur-preserved forest with blackbuck and deer.", category: "nature" },
  ],
  tandoadam: [
    { name: "Shrine of Oderolal", note: "Ancient shrine revered by both Muslims and Hindus.", category: "shrine" },
    { name: "Shrine of Shah Abdul Latif Bhittai", note: "Major Sufi shrine at Bhit Shah, about 16 km away.", category: "shrine" },
    { name: "Mausoleum of Makhdum Nuh", note: "Suhrawardi Sufi shrine at nearby Hala town.", category: "shrine" },
    { name: "Hala", note: "Nearby town famous for Sindhi tiles, pottery and Ajrak.", category: "town" },
  ],

  // --- KPK ---
  mardan: [
    { name: "Takht-i-Bahi", note: "UNESCO Buddhist monastery from the 1st century CE.", category: "historical" },
    { name: "Jamal Garhi", note: "Ancient Buddhist monastery and stupa ruins near Mardan.", category: "historical" },
    { name: "Shahbaz Garhi Rock Edicts", note: "3rd-century BC Ashokan rock inscriptions in Kharosthi.", category: "historical" },
    { name: "Mardan Museum", note: "Gandhara, Kushan, Islamic and ethnological artifacts.", category: "museum" },
    { name: "Mardan Park", note: "City park popular for morning walks and family outings.", category: "park" },
  ],
  abbottabad: [
    { name: "Ilyasi Mosque", note: "Historic white mosque built over a natural spring, 1920s.", category: "religious" },
    { name: "Shimla Hill Park", note: "Pine-covered hill with a family park and city viewpoint.", category: "viewpoint" },
    { name: "Thandiani", note: "Serene hill station 2,700m high, northeast of the city.", category: "nature" },
    { name: "Harnoi Lake", note: "Mountain excursion spot with a stream toward Nathia Gali.", category: "lake" },
  ],
  mansehra: [
    { name: "Ashoka Rock Edicts", note: "14 edicts carved on granite boulders, 3rd century BC.", category: "historical" },
    { name: "Bareri Hills", note: "Scenic hilltop near the rock edicts with greenery.", category: "viewpoint" },
    { name: "Sharan Forest", note: "Lush forest for trekking, hiking and camping.", category: "nature" },
    { name: "Hazara University", note: "Scenic campus worth a look for its surroundings.", category: "historical" },
  ],
  kohat: [
    { name: "Kohat Fort", note: "19th-century fort with panoramic views of the city.", category: "fort" },
    { name: "Tanda Dam", note: "Scenic dam popular for picnics, boating and fishing.", category: "lake" },
    { name: "Tanda Wildlife Park", note: "Park with deer, leopards and peacocks amid greenery.", category: "park" },
    { name: "Kohat Tunnel", note: "Notable road tunnel through the hills near the city.", category: "viewpoint" },
  ],
  swabi: [
    { name: "Hund Museum", note: "Gandhara, Hindu Shahi and Islamic artifacts on the Indus.", category: "museum" },
    { name: "Tarbela Dam", note: "World's largest earth-filled dam, on the Indus near Topi.", category: "lake" },
    { name: "Rani Ghat", note: "Ancient Buddhist Gandhara-era ruins on a hilltop.", category: "historical" },
    { name: "Kund Park", note: "National park where the Indus and Kabul rivers meet.", category: "park" },
  ],
  nowshera: [
    { name: "Cherat", note: "Hill station at 1,372m with a cold climate and winter snow.", category: "viewpoint" },
    { name: "Ziarat Kaka Sahib", note: "16th-century Sufi saint's shrine, 12 km south of the city.", category: "shrine" },
    { name: "Tomb of Khushal Khan Khattak", note: "Burial place of the famed Pashto poet at Akora Khattak.", category: "shrine" },
    { name: "Manglot Wildlife Park", note: "Wildlife sanctuary on the Khwara Range near the Indus.", category: "park" },
  ],
  dikhan: [
    { name: "Kafir Kot", note: "7th-10th century Hindu Shahi temple complex and fort.", category: "historical" },
    { name: "Rehman Dheri", note: "Pre-Harappan archaeological site dating to around 4000 BC.", category: "historical" },
    { name: "Bilot Fort", note: "Pre-Islamic fort 48 km away on the Chashma road.", category: "fort" },
    { name: "Takht-e-Sulaiman", note: "Highest Sulaiman Range peak, popular for trekking.", category: "nature" },
    { name: "Kulachi Town", note: "Walled British-era town with old bazaars and shrines.", category: "bazaar" },
  ],
  bannu: [
    { name: "Bannu Fort", note: "British colonial-era fort with thick walls and battlements.", category: "fort" },
    { name: "Bannu Bazaar", note: "Vibrant market famed for cotton textiles and handicrafts.", category: "bazaar" },
    { name: "Bannu Museum", note: "Manuscripts, pottery, weapons and textiles of the region.", category: "museum" },
    { name: "Baran Dam", note: "Dam near the city used for irrigation and outings.", category: "lake" },
    { name: "Mir Jani Shah Park", note: "Green park with pathways, ideal for family outings.", category: "park" },
  ],
  charsadda: [
    { name: "Bala Hisar", note: "Ancient fortified mound, excavated by Marshall and Wheeler.", category: "historical" },
    { name: "Pushkalavati", note: "Ruins of the ancient Gandhara capital city.", category: "historical" },
    { name: "Pushkalavati Museum", note: "Charsadda museum (2006) with regional artifacts.", category: "museum" },
    { name: "Sardaryab", note: "Riverside picnic spot famous for its fish.", category: "nature" },
    { name: "Shrine of Yousaf Baba", note: "Local Sufi shrine and visiting spot in the district.", category: "shrine" },
  ],
  haripur: [
    { name: "Khanpur Dam", note: "Lake hub for jet-skiing, paragliding and cliff diving.", category: "lake" },
    { name: "Tarbela Dam", note: "Vast earth-filled dam with scenic hills and views.", category: "lake" },
    { name: "Bhamala Stupa", note: "Important Gandhara-era Buddhist archaeological site.", category: "historical" },
    { name: "Noori Waterfall", note: "Scenic waterfall popular with tourists near the city.", category: "nature" },
    { name: "Sarkari Bagh", note: "One of the oldest, greenest parks in Haripur city.", category: "park" },
  ],

  // --- Balochistan & AJK ---
  gwadar: [
    { name: "Koh-e-Batil", note: "Hilltop viewpoint reached by staircase overlooking the bay.", category: "viewpoint" },
    { name: "Hammerhead", note: "Hammer-shaped peninsula formed by a coastal mud volcano.", category: "nature" },
    { name: "Gwadar Marine Drive", note: "Coastal road stretching along the city's beach front.", category: "nature" },
    { name: "Sunset Park", note: "Popular sunset-viewing park at Sanghar Housing Scheme.", category: "park" },
    { name: "Kund Malir Beach", note: "Crystal-clear beach along the Makran Coastal Highway.", category: "beach" },
  ],
  turbat: [
    { name: "Miri Qila (Punnu Fort)", note: "Ancient mud-brick fortress tied to the Sassi-Punnu legend.", category: "fort" },
    { name: "Koh-e-Murad", note: "Mountain shrine of major religious importance to pilgrims.", category: "shrine" },
    { name: "Kech Museum", note: "Makran archaeological artifacts, pottery, coins and weaponry.", category: "museum" },
    { name: "Mirani Dam", note: "Reservoir in the Kech valley, popular with birdwatchers.", category: "lake" },
    { name: "Kech River banks", note: "Lush riverside amid date-palm groves, good for picnics.", category: "nature" },
  ],
  khuzdar: [
    { name: "Moola Chotok", note: "Hidden waterfall and ravine reached by 4x4 through cliffs.", category: "nature" },
    { name: "Pir Chattal Noorani", note: "Sacred site near Gandhawa known for natural beauty.", category: "shrine" },
    { name: "Hingol National Park", note: "Vast park with unique landscapes and wildlife nearby.", category: "nature" },
  ],
  chaman: [
    { name: "Khojak Pass", note: "Scenic mountain pass through the Toba Kakar Range.", category: "viewpoint" },
    { name: "Khojak Tunnel", note: "1891 British-era railway tunnel, one of Pakistan's longest.", category: "historical" },
    { name: "Bab-e-Dosti", note: "Friendship Gate border crossing with Afghanistan.", category: "historical" },
    { name: "Chaman Bazaar", note: "Busy trade market famed for plums, grapes and peaches.", category: "bazaar" },
  ],
  sibi: [
    { name: "Jirga Hall", note: "1903 Queen Victoria Memorial Hall, now a cultural complex.", category: "historical" },
    { name: "Sibi Museum", note: "Local artifacts set within the historic Jirga Hall.", category: "museum" },
    { name: "Mir Chakar's Fort", note: "15th-century fort ruins on the outskirts of Sibi.", category: "fort" },
    { name: "Sohbat Sarai", note: "Historic 1920 caravanserai being restored as heritage.", category: "historical" },
    { name: "Mehrgarh", note: "Ancient Indus-era farming settlement near the Bolan Pass.", category: "historical" },
  ],
  mirpurajk: [
    { name: "Mangla Dam", note: "Huge reservoir offering boating and water sports.", category: "lake" },
    { name: "Ramkot Fort", note: "16th-century hilltop fort reached by boat across Mangla.", category: "fort" },
    { name: "Darbar-e-Aalia Khari Sharif", note: "Revered Sufi shrine complex near Mirpur.", category: "shrine" },
    { name: "Chakswari Bazaar", note: "Market for local handicrafts and traditional clothing.", category: "bazaar" },
  ],
  muzaffarabad: [
    { name: "Red Fort (Rutta Qila)", note: "16th-century Chak-era riverside fort on the Neelum, later expanded by the Mughals.", category: "fort" },
    { name: "Pir Chinasi", note: "Hilltop shrine of Sayed Hussain Shah Bukhari at 2,900m, famed for paragliding and sweeping views.", category: "shrine" },
    { name: "Domel Confluence", note: "Striking point where the emerald Neelum meets the silt-laden Jhelum River.", category: "nature" },
    { name: "Subri (Langarpura) Lake", note: "Calm lake on the city's edge popular for boating and picnics.", category: "lake" },
    { name: "Patrind Dam", note: "Scenic hydropower reservoir on the Jhelum, a popular day-trip spot.", category: "lake" },
  ],
  kotli: [
    { name: "Throchi Fort", note: "Hilltop Mughal-era fort (c.1460), called the 'crown of Kotli'.", category: "fort" },
    { name: "Gulpur Waterfall", note: "50-foot crystal-clear cascade with views over the Poonch valley.", category: "nature" },
    { name: "Saarda Point", note: "Viewpoint minutes from the city, famed for sunsets over the Poonch River.", category: "viewpoint" },
    { name: "Teenda Valley", note: "Tranquil green meadows and breezy vantage points near Kotli city.", category: "nature" },
  ],
  bagh: [
    { name: "Ganga Choti", note: "Iconic 3,000m+ peak reached on meadow-and-forest trails, Bagh's highest landmark.", category: "viewpoint" },
    { name: "Las Danna", note: "Pine-forested ridge ~15km away, the breezy 'rooftop of Bagh'.", category: "nature" },
    { name: "Pir Kanthi", note: "Quiet, less-crowded mountain with breathtaking views over the Bagh valleys.", category: "viewpoint" },
    { name: "Dhirkot", note: "Green hill town in Bagh district, a cool pine-clad retreat.", category: "town" },
  ],
  bhimber: [
    { name: "Baghsar Fort", note: "Mughal hill fort in Samahni Valley where Emperor Jahangir is said to have died.", category: "fort" },
    { name: "Baghsar Lake", note: "Serene half-km lake at 975m drawing migratory geese and ducks.", category: "lake" },
    { name: "Samahni Valley", note: "Lush 35km valley of waterfalls, streams and pine forest, 17km from Bhimber.", category: "nature" },
  ],
  palandri: [
    { name: "Pallandri Fort (Baral Fort)", note: "Historic hill fort overlooking the Sudhanoti district town.", category: "fort" },
    { name: "Garatapar Waterfall", note: "Wide cascade tumbling over rocks near Tarar Khel.", category: "nature" },
    { name: "Darbar-e-Alia Nerian Sharif", note: "Mountain-set Sufi shrine at Tarar Khel, a major pilgrimage site.", category: "shrine" },
    { name: "Nagaishwar", note: "Scenic 2,006m spot known for its colourful landscape and calm climate.", category: "viewpoint" },
  ],
  hattianbala: [
    { name: "Zalzal Lake", note: "Lake formed by 2005-earthquake landslides near Chikar; clear waters good for fishing.", category: "lake" },
    { name: "Leepa Valley", note: "Terraced red-rice valley near the LoC, famed for apples, cherries and walnuts.", category: "nature" },
    { name: "Chinari", note: "Hill station on the Jhelum River, 9km out on the Chakothi road.", category: "viewpoint" },
    { name: "Chikar", note: "Lush meadow hill station 18km away on the Sudhan Gali road.", category: "nature" },
  ],
  athmuqam: [
    { name: "Upper Neelum", note: "Village high above Athmuqam with panoramic views over the Neelum Valley.", category: "viewpoint" },
    { name: "Kutton (Jagran) Waterfall", note: "Popular waterfall in the side Jagran Valley off the Neelum road.", category: "nature" },
    { name: "Dhani Noseri Waterfall", note: "One of the Neelum Valley's largest waterfalls, in the lower valley.", category: "nature" },
    { name: "Athmuqam Bazaar", note: "Riverside district-HQ market, the gateway town to upper Neelum.", category: "bazaar" },
  ],
  forwardkahuta: [
    { name: "Neel Fairy Meadows (Neel Fari)", note: "Panoramic alpine meadow at the foot of Bedori Peak.", category: "nature" },
    { name: "Haji Pir Pass (Darra Haji Peer)", note: "Historic high mountain pass on the LoC near Kahuta.", category: "viewpoint" },
    { name: "Sharo Dahara", note: "Quiet green hill area near Forward Kahuta, popular for nature walks.", category: "nature" },
    { name: "Hillian Waterfall", note: "Scenic waterfall set amid the district's forested hills.", category: "nature" },
  ],

  // --- Additional cities (2026) ---
  mingora: [
    { name: "White Palace, Marghazar", note: "1940 former summer palace of the Wali of Swat, near Mingora.", category: "historical" },
    { name: "Swat Museum", note: "Houses Gandhara and Buddhist-era artifacts from the valley.", category: "museum" },
    { name: "Mingora Bazaar", note: "Bustling market for Swati handicrafts, jewellery and local goods.", category: "bazaar" },
  ],
  wahcantt: [
    { name: "Wah Gardens", note: "Mughal-era terraced gardens with fountains and water channels.", category: "garden" },
    { name: "Gurdwara Panja Sahib", note: "Major Sikh shrine in nearby Hasan Abdal with Guru Nanak's handprint.", category: "religious" },
    { name: "Tomb of Lala Rukh", note: "Mughal-era tomb in Hasan Abdal beside Hakim's Tomb.", category: "historical" },
  ],
  kamoke: [
    { name: "Kamoke Rice Market", note: "One of the subcontinent's largest basmati rice markets.", category: "bazaar" },
    { name: "Grand Trunk Road", note: "Historic highway passing through the town toward Lahore.", category: "historical" },
  ],
  burewala: [
    { name: "Shrine of Baba Haji Sher Muhammad Qalandar", note: "Popular Sufi shrine drawing devotees to the town.", category: "shrine" },
    { name: "Fawara Chowk", note: "Central fountain roundabout and city landmark.", category: "historical" },
    { name: "Burewala Stadium", note: "Local cricket and sports venue hosting community matches.", category: "park" },
  ],
  sadiqabad: [
    { name: "Bhong Mosque", note: "Aga Khan Award-winning mosque in nearby Bhong village.", category: "religious" },
    { name: "Cholistan Desert", note: "Vast desert landscape stretching east of the town.", category: "nature" },
  ],
  khanpur: [
    { name: "Khanqah-e-Aaliya Qadriya", note: "Revered Sufi khanqah at Deenpur Sharif near Khanpur.", category: "shrine" },
    { name: "Patan Minara", note: "Ancient minaret and ruins of Hakra-valley antiquity nearby.", category: "historical" },
    { name: "Cholistan Desert", note: "Desert safari country with dunes south of the town.", category: "nature" },
  ],
  gojra: [
    { name: "Manzoor Elahi Forest Park", note: "Forest park on Jhang Road with playgrounds and pathways.", category: "park" },
    { name: "Gojra Grain Market", note: "Important regional grain market on the railway branch.", category: "bazaar" },
  ],
  bahawalnagar: [
    { name: "Bahawalnagar Wildlife Park", note: "15-acre park with blackbuck, ostriches and peafowl.", category: "park" },
    { name: "Marot Fort", note: "Late-18th-century Nawab-era fort in the Cholistan desert.", category: "fort" },
    { name: "Sutlej River banks", note: "Riverside and canal-bank recreation spots near the city.", category: "nature" },
  ],
  muridke: [
    { name: "Shrine of Hazrat Shah Murid", note: "17th-century Sufi shrine, the town's namesake.", category: "shrine" },
    { name: "Muridke Sabzi Mandi", note: "One of Punjab's largest vegetable markets.", category: "bazaar" },
  ],
  pakpattan: [
    { name: "Shrine of Baba Farid Ganjshakar", note: "Major Sufi shrine with the silver Bahishti Darwaza.", category: "shrine" },
    { name: "Malka Hans", note: "Historic town where Waris Shah composed the epic Heer.", category: "historical" },
    { name: "Chan Pir Darbar", note: "Shrine 7 km out hosting a seven-day spring festival.", category: "shrine" },
  ],
  jaranwala: [
    { name: "Pakistani Gate", note: "Historic 1917 town gate, formerly O'Dwyer Gate.", category: "historical" },
    { name: "Committee Bagh", note: "Public park with historical monuments in the city.", category: "park" },
    { name: "Mahtab Masjid", note: "Mosque admired for its intricate architecture.", category: "religious" },
  ],
  chishtian: [
    { name: "Shrine of Taj Sarwar Chishti", note: "Tomb marking the town's reputed 13th-century founding site.", category: "shrine" },
    { name: "Jamia Mosque", note: "Old mosque showcasing traditional Islamic architecture.", category: "religious" },
    { name: "Chishtian Lake", note: "Local lake used for fishing and a recreational picnic spot.", category: "lake" },
  ],
  daska: [
    { name: "Shahab Masjid", note: "Mughal-era mosque, one of Daska's iconic historical sites.", category: "religious" },
    { name: "Shaheedan Wala Qabrastan", note: "Burial site of 19 Lancers martyrs of the 1965 war.", category: "historical" },
  ],
  ahmadpureast: [
    { name: "Sadiq Garh Palace", note: "Grand 1882 Abbasi royal palace at nearby Dera Nawab Sahib.", category: "historical" },
    { name: "Derawar Fort", note: "Massive 9th-century desert fort in the Cholistan, near the town.", category: "fort" },
    { name: "Sadiq Garh Mosque", note: "Historic royal mosque within the Dera Nawab Sahib complex.", category: "religious" },
  ],
  kamalia: [
    { name: "Jahangir-era Mosque", note: "Ancient mosque reflecting Mughal architectural influences.", category: "religious" },
    { name: "Shrine of Baba Fazil Dewan", note: "Revered Sufi shrine and spiritual centre in the city.", category: "shrine" },
    { name: "Kamalia Wildlife Park", note: "Family amusement park on the Kamalia-Chichawatni road.", category: "park" },
  ],
  wazirabad: [
    { name: "Qila Wazirabad", note: "Historic Mughal-era fortress in the heart of the city.", category: "fort" },
    { name: "Wazir Khan Baradari", note: "Elegant Mughal-era garden pavilion in Wazirabad.", category: "historical" },
    { name: "Chenab River Bridge", note: "Historic British-era railway bridge over the Chenab.", category: "historical" },
  ],
  khushab: [
    { name: "Soon Valley", note: "Scenic green valley and lake district in the Salt Range.", category: "nature" },
    { name: "Uchhali Lake", note: "Salt-water lake with boating, a top valley attraction.", category: "lake" },
    { name: "Kanhatti Garden", note: "Garden resort with waterfalls, hiking trails and camping.", category: "garden" },
    { name: "Sakesar Peak", note: "Highest Salt Range peak at about 5,010 feet elevation.", category: "viewpoint" },
  ],
  kotadu: [
    { name: "Taunsa Barrage", note: "Indus River barrage about 16 km from Kot Adu.", category: "lake" },
    { name: "Bagh-e-Sardaran", note: "Well-maintained public garden good for a leisurely stroll.", category: "garden" },
    { name: "Indus River bank", note: "Riverside spot popular with picnickers and day visitors.", category: "nature" },
  ],
  chichawatni: [
    { name: "Chichawatni Forest Plantation", note: "1923 plantation, second-largest man-made forest in Pakistan.", category: "nature" },
    { name: "Harappa Archaeological Site", note: "Ancient Indus Valley city ruins and museum nearby.", category: "historical" },
    { name: "Harappa Museum", note: "1926 museum displaying Indus Valley Civilization artifacts.", category: "museum" },
  ],
  kandhkot: [
    { name: "Guddu Barrage", note: "Large 1962 Indus River barrage, a popular day outing.", category: "lake" },
    { name: "Indus Dolphin Reserve", note: "River reserve protecting the endangered blind Indus dolphin.", category: "nature" },
    { name: "Kandhkot Grain Market", note: "One of the region's largest grain markets.", category: "bazaar" },
  ],
  tandoallahyar: [
    { name: "Tando Allahyar Fort", note: "18th-century fort offering views over the surrounding area.", category: "fort" },
    { name: "Shrine of Shaikh Bhirkio", note: "Important Suhrawardi Sufi centre 25 km southwest of town.", category: "shrine" },
    { name: "Shrine of Pir Patho", note: "Revered Sufi saint shrine attracting pilgrims and visitors.", category: "shrine" },
  ],
};

export function cityPlaces(id: string): CityPlace[] {
  return CITY_PLACES[id] ?? [];
}
