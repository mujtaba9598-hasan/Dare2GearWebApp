// Dare2Gear — rich destination content + hotel listings
// ---------------------------------------------------------------------------
// This is the "what to see + where to stay" layer that powers the destination
// detail pages (/destinations/[id]). It is intentionally kept separate from the
// planner dataset in `data.ts` so a future admin panel can manage this content
// (add/remove spots, hotels, photos) without touching the cost engine.
//
// Photos are royalty-free placeholders (Pexels) bundled under /public.
// Replace freely later via the admin panel.

export type SpotCategory =
  | "lake"
  | "valley"
  | "fort"
  | "viewpoint"
  | "trek"
  | "town"
  | "beach"
  | "religious"
  | "wildlife"
  | "glacier";

export interface Spot {
  name: string;
  blurb: string;
  category: SpotCategory;
}

export type SkillLevel = "intermediate" | "advanced" | "expert";

/** A dangerous / technical off-road track near a destination. */
export interface DangerTrack {
  name: string;
  blurb: string;
  /** What kind of machine realistically gets you through. */
  bikeNeeded: string;
  skill: SkillLevel;
  warning: string;
}

export interface DestinationContent {
  /** Hero banner photo path under /public. */
  hero: string;
  /** Short evocative one-liner shown under the title. */
  tagline: string;
  /** A few scenery thumbnails for the photo strip. */
  gallery: string[];
  spots: Spot[];
  tracks?: DangerTrack[];
}

export interface HotelListing {
  id: string;
  destinationId: string;
  name: string;
  photo: string;
  /** PKR per night, double room. Kept affordable (<= 2500) for now. */
  pricePerNight: number;
  area: string;
  amenities: string[];
  rating: number;
}

export const SKILL_LABELS: Record<SkillLevel, string> = {
  intermediate: "Intermediate riders",
  advanced: "Advanced riders",
  expert: "Experts only",
};

export const SPOT_LABELS: Record<SpotCategory, string> = {
  lake: "Lake",
  valley: "Valley",
  fort: "Fort / heritage",
  viewpoint: "Viewpoint",
  trek: "Trek",
  town: "Town / bazaar",
  beach: "Beach",
  religious: "Religious site",
  wildlife: "Wildlife",
  glacier: "Glacier",
};

const SCENERY = {
  karakoram: "/scenery/s01.jpg",
  fort: "/scenery/s02.jpg",
  turquoise: "/scenery/s03.jpg",
  greenValley: "/scenery/s04.jpg",
  riverBridge: "/scenery/s05.jpg",
  meadow: "/scenery/s06.jpg",
  autumnLake: "/scenery/s07.jpg",
  snowLake: "/scenery/s08.jpg",
  coast: "/scenery/s09.jpg",
  attabad: "/scenery/s10.jpg",
} as const;

// ---------------------------------------------------------------------------
// Destination content
// ---------------------------------------------------------------------------
export const CONTENT: Record<string, DestinationContent> = {
  murree: {
    hero: "/destinations/murree.jpg",
    tagline: "Pine-clad ridges and the classic Mall Road getaway.",
    gallery: [SCENERY.meadow, SCENERY.autumnLake, SCENERY.karakoram],
    spots: [
      { name: "Mall Road", blurb: "The bustling pedestrian heart of Murree — cafés, food and mountain views.", category: "town" },
      { name: "Patriata (New Murree) Chairlift", blurb: "Ride the chairlift and cable car over pine forest to a 2,300m ridge.", category: "viewpoint" },
      { name: "Pindi Point", blurb: "Sweeping view toward Rawalpindi with a short cable-car ride.", category: "viewpoint" },
      { name: "Kashmir Point", blurb: "Clear-day views toward the hills of Azad Kashmir.", category: "viewpoint" },
      { name: "Bhurban", blurb: "Quieter resort ridge just before Murree, popular for forest walks.", category: "valley" },
    ],
  },

  nathiagali: {
    hero: "/destinations/nathiagali.jpg",
    tagline: "Cool cedar forests on the Galyat ridge.",
    gallery: [SCENERY.meadow, SCENERY.karakoram, SCENERY.greenValley],
    spots: [
      { name: "Mukshpuri Top Trek", blurb: "A 2-3 hour forest trail to a 2,800m summit with Galyat panoramas.", category: "trek" },
      { name: "Miranjani Trek", blurb: "The highest point of the Galyat range, through dense pine forest.", category: "trek" },
      { name: "Pipeline Track", blurb: "Easy, near-level forest walk linking Nathia Gali and Dunga Gali.", category: "trek" },
      { name: "Governor House", blurb: "Colonial-era residence framed by towering cedars.", category: "viewpoint" },
      { name: "Lalazar", blurb: "A green meadow shoulder with picnic spots and big views.", category: "valley" },
    ],
  },

  naran: {
    hero: "/destinations/naran.jpg",
    tagline: "Glacial lakes and alpine meadows in the Kaghan Valley.",
    gallery: [SCENERY.snowLake, SCENERY.turquoise, SCENERY.meadow],
    spots: [
      { name: "Lake Saif-ul-Malook", blurb: "The legendary glacial lake mirroring Malika Parbat — a short jeep ride from Naran.", category: "lake" },
      { name: "Lulusar Lake", blurb: "A long alpine lake on the road to Babusar, source of the Kunhar River.", category: "lake" },
      { name: "Babusar Top", blurb: "A 4,173m pass linking Kaghan to Gilgit-Baltistan with vast views.", category: "viewpoint" },
      { name: "Shogran & Siri Paye", blurb: "A forested plateau and the famous Siri Paye meadows above it.", category: "valley" },
      { name: "Ansoo Lake", blurb: "A tear-shaped lake reached by a demanding high-altitude trek.", category: "trek" },
    ],
  },

  swat: {
    hero: "/destinations/swat.jpg",
    tagline: "The 'Switzerland of Pakistan' — green valleys and rivers.",
    gallery: [SCENERY.greenValley, SCENERY.riverBridge, SCENERY.meadow],
    spots: [
      { name: "Kalam", blurb: "The valley's scenic hub where the Ushu and Utror rivers meet.", category: "town" },
      { name: "Mahodand Lake", blurb: "A glacier-fed lake ringed by forest, a rough drive up from Kalam.", category: "lake" },
      { name: "Malam Jabba", blurb: "Pakistan's premier ski resort with a chairlift and zipline.", category: "viewpoint" },
      { name: "Ushu Forest", blurb: "Dense alpine pine forest along the river above Kalam.", category: "valley" },
      { name: "Bahrain", blurb: "A riverside bazaar town famous for handicrafts and trout.", category: "town" },
      { name: "Kumrat Valley", blurb: "A pristine pine-forest valley on the Panjkora river in Upper Dir — waterfalls, open meadows and the trek up to Jahaz Banda and Katora Lake.", category: "valley" },
    ],
  },

  neelum: {
    hero: "/destinations/neelum.jpg",
    tagline: "A long emerald river valley of villages and waterfalls.",
    gallery: [SCENERY.greenValley, SCENERY.turquoise, SCENERY.riverBridge],
    spots: [
      { name: "Keran", blurb: "A riverside village facing the Indian-administered Keran across the Neelum.", category: "town" },
      { name: "Sharda", blurb: "Home to the ancient Sharda Peeth ruins and a popular base.", category: "religious" },
      { name: "Arang Kel", blurb: "A storybook meadow village reached by chairlift and a steep climb above Kel.", category: "valley" },
      { name: "Ratti Gali Lake", blurb: "An alpine lake of intense blues, a jeep-plus-trek above Dowarian.", category: "lake" },
      { name: "Taobat", blurb: "The last village of the valley, deep toward the Shounter pass.", category: "town" },
      { name: "Baboon Meadows (Baboon Valley)", blurb: "A high alpine meadow at ~12,600 ft above Keran and Jagran, reached by a steep hike to Baboon Top — vast meadows ringed by snow peaks.", category: "trek" },
    ],
    tracks: [
      {
        name: "Kel → Taobat rough road",
        blurb: "Beyond Kel the road narrows to a rocky shelf above the Neelum, prone to landslides and washouts after rain.",
        bikeNeeded: "150cc+ with good tyres, or a 4x4",
        skill: "advanced",
        warning: "Avoid after heavy rain — sections can be cut off by sliding scree.",
      },
    ],
  },

  gorakh: {
    hero: "/destinations/gorakh.jpg",
    tagline: "Sindh's only hill station — a high desert plateau.",
    gallery: [SCENERY.autumnLake, SCENERY.meadow, SCENERY.coast],
    spots: [
      { name: "Sunset Point", blurb: "The plateau edge at ~1,700m, famous for cold nights and big sunsets.", category: "viewpoint" },
      { name: "Camping Plateau", blurb: "Open grassland ideal for tents and bonfires under clear skies.", category: "valley" },
      { name: "Star Gazing", blurb: "Some of the darkest skies in Sindh, far from any city glow.", category: "viewpoint" },
      { name: "Wahi Pandhi Drive", blurb: "The winding mountain road that climbs to the plateau from the plains.", category: "trek" },
    ],
  },

  leepa: {
    hero: SCENERY.greenValley,
    tagline: "Terraced orchards and wooden houses in a hidden LoC valley.",
    gallery: [SCENERY.greenValley, SCENERY.meadow, SCENERY.riverBridge],
    spots: [
      { name: "Reshian Gali", blurb: "The high forested pass that opens into the Leepa valley — often the first snow point.", category: "viewpoint" },
      { name: "Dao Khun", blurb: "A lush meadow hamlet of terraced rice fields and wooden Kashmiri homes.", category: "valley" },
      { name: "Chananian", blurb: "A scenic village known for its apple, cherry and walnut orchards.", category: "valley" },
      { name: "Leepa Bazaar", blurb: "The valley's small main bazaar for local honey, rajma and handicrafts.", category: "town" },
      { name: "Naullishaw", blurb: "A quiet upper-valley spot with panoramic terraced-field views.", category: "viewpoint" },
    ],
  },

  gangachoti: {
    hero: SCENERY.meadow,
    tagline: "A meadow summit and Kashmir's favourite day hike above Bagh.",
    gallery: [SCENERY.meadow, SCENERY.greenValley, SCENERY.snowLake],
    spots: [
      { name: "Sudhan Gali", blurb: "The 2,300m forested pass that is the trailhead for Ganga Choti.", category: "viewpoint" },
      { name: "Ganga Choti Summit", blurb: "A 3,044m grassy peak with 360° views over the Kashmir ranges.", category: "trek" },
      { name: "Las Danna", blurb: "A pine-clad ridge near Bagh, the breezy 'rooftop' of the district.", category: "viewpoint" },
      { name: "Pir Kanthi", blurb: "A quieter neighbouring summit with sweeping, uncrowded valley views.", category: "trek" },
      { name: "Dhirkot", blurb: "A green hill town en route, a cool pine retreat for a halt.", category: "town" },
    ],
  },

  pirchinasi: {
    hero: SCENERY.karakoram,
    tagline: "A shrine-topped ridge with sweeping views over Muzaffarabad.",
    gallery: [SCENERY.karakoram, SCENERY.meadow, SCENERY.greenValley],
    spots: [
      { name: "Pir Chinasi Shrine", blurb: "The hilltop ziarat of Sayed Hussain Shah Bukhari at 2,900m.", category: "religious" },
      { name: "Saral Lake", blurb: "An alpine lake on the high meadows beyond Pir Chinasi (long trek/jeep).", category: "lake" },
      { name: "Patika", blurb: "A green roadside town on the Neelum road below the ridge.", category: "town" },
      { name: "Lohar Gali", blurb: "A forested pass with panoramic views on the way up.", category: "viewpoint" },
      { name: "Subri Lake", blurb: "A calm lake on the edge of Muzaffarabad for a relaxed stop.", category: "lake" },
    ],
  },

  hunza: {
    hero: "/destinations/hunza.jpg",
    tagline: "Orchards, ancient forts and 7,000m peaks on every side.",
    gallery: [SCENERY.attabad, SCENERY.fort, SCENERY.karakoram],
    spots: [
      { name: "Baltit Fort", blurb: "The 700-year-old fort above Karimabad, restored as a museum.", category: "fort" },
      { name: "Altit Fort", blurb: "Hunza's oldest monument, perched on a cliff over the river.", category: "fort" },
      { name: "Attabad Lake", blurb: "A stunning turquoise lake formed by a 2010 landslide.", category: "lake" },
      { name: "Eagle's Nest (Duikar)", blurb: "The classic sunrise viewpoint over Hunza and Rakaposhi.", category: "viewpoint" },
      { name: "Passu Cones", blurb: "The cathedral-like jagged peaks above Passu village.", category: "viewpoint" },
      { name: "Hussaini Suspension Bridge", blurb: "A famously rickety plank bridge over the Hunza River.", category: "viewpoint" },
    ],
  },

  skardu: {
    hero: "/destinations/skardu.jpg",
    tagline: "Gateway to the Karakoram — cold deserts and turquoise lakes.",
    gallery: [SCENERY.turquoise, SCENERY.snowLake, SCENERY.karakoram],
    spots: [
      { name: "Shangrila (Lower Kachura) Lake", blurb: "The iconic heart-shaped resort lake with its red-roofed restaurant.", category: "lake" },
      { name: "Upper Kachura Lake", blurb: "A deeper, quieter lake a short walk beyond Shangrila.", category: "lake" },
      { name: "Shigar Fort", blurb: "A 17th-century Raja's fort restored as a heritage hotel and museum.", category: "fort" },
      { name: "Katpana Cold Desert", blurb: "High-altitude sand dunes — among the highest cold deserts on earth.", category: "viewpoint" },
      { name: "Soq Valley", blurb: "A lesser-known green valley of terraced fields above Skardu.", category: "valley" },
      { name: "Basho Valley", blurb: "A forested off-the-grid valley reached by a rough jeep track.", category: "valley" },
      { name: "Manthokha Waterfall", blurb: "A thundering ~180ft waterfall in the Kharmang valley.", category: "viewpoint" },
      { name: "Sadpara Lake", blurb: "The lake above Skardu town on the road to Deosai.", category: "lake" },
    ],
    tracks: [
      {
        name: "Basho Valley jeep track",
        blurb: "A rough, rocky off-road climb into the forest — loose surface, water crossings and steep switchbacks.",
        bikeNeeded: "150cc+ dual-sport / trail bike, or a 4x4 jeep",
        skill: "advanced",
        warning: "Not for street bikes or beginners. Go with a local and never alone.",
      },
      {
        name: "Skardu → Deosai crossing",
        blurb: "The high-altitude track onto the Deosai plateau (~4,000m) with river fords and no fuel or help for hours.",
        bikeNeeded: "Reliable 250cc+ adventure bike, or a 4x4",
        skill: "expert",
        warning: "Altitude, cold and stream crossings — only with proper gear and a convoy.",
      },
    ],
  },

  gilgit: {
    hero: "/destinations/gilgit.jpg",
    tagline: "The bustling hub of the north and gateway to Hunza.",
    gallery: [SCENERY.greenValley, SCENERY.karakoram, SCENERY.meadow],
    spots: [
      { name: "Naltar Valley", blurb: "Pine forests, a ski slope and the famous blue Naltar lakes.", category: "valley" },
      { name: "Kargah Buddha", blurb: "A 7th-century rock-carved Buddha just outside Gilgit.", category: "religious" },
      { name: "Rakaposhi View Point", blurb: "A roadside terrace facing the 7,788m wall of Rakaposhi.", category: "viewpoint" },
      { name: "Naltar Lakes", blurb: "A jeep ride above Naltar to a cluster of vivid alpine lakes.", category: "lake" },
    ],
  },

  chitral: {
    hero: "/destinations/chitral.jpg",
    tagline: "Remote valleys below Tirich Mir and the Kalash homeland.",
    gallery: [SCENERY.greenValley, SCENERY.riverBridge, SCENERY.fort],
    spots: [
      { name: "Kalash Valleys", blurb: "Bumburet, Rumbur and Birir — home of the unique pagan Kalash people.", category: "valley" },
      { name: "Shandur Pass", blurb: "The 'roof of the world' polo ground at 3,700m between Chitral and Gilgit.", category: "viewpoint" },
      { name: "Chitral Fort", blurb: "The riverside fort of the former Mehtars of Chitral.", category: "fort" },
      { name: "Garam Chashma", blurb: "A valley of natural hot springs north-west of Chitral town.", category: "valley" },
    ],
    tracks: [
      {
        name: "Shandur Pass road",
        blurb: "A long, rough high-altitude track over 3,700m — unpaved sections, river crossings and thin air.",
        bikeNeeded: "150cc+ in good condition, or a 4x4",
        skill: "advanced",
        warning: "Weather turns fast at the top; carry fuel and warm gear.",
      },
    ],
  },

  astore: {
    hero: "/destinations/astore.jpg",
    tagline: "A quiet alpine valley at the foot of Nanga Parbat.",
    gallery: [SCENERY.snowLake, SCENERY.meadow, SCENERY.turquoise],
    spots: [
      { name: "Rama Lake", blurb: "A serene forest-ringed lake above Rama meadows.", category: "lake" },
      { name: "Rama Meadows", blurb: "Wide green pastures facing the snows of Nanga Parbat.", category: "valley" },
      { name: "Nanga Parbat (Rupal Face) View", blurb: "The view toward the world's highest mountain face.", category: "viewpoint" },
      { name: "Minimarg", blurb: "A lush border valley beyond Astore, reached over a rough pass.", category: "valley" },
    ],
  },

  khaplu: {
    hero: "/photos/destinations/khaplu/khaplu-fort.jpg",
    tagline: "An ancient royal valley on the Shyok, gateway to the Hushe peaks.",
    gallery: [],
    spots: [
      { name: "Khaplu Palace (Yabgo Khar)", blurb: "A 19th-century Raja's palace restored as a heritage hotel and museum — among the finest surviving in Baltistan.", category: "fort" },
      { name: "Chaqchan Mosque", blurb: "A roughly 700-year-old mosque blending Tibetan, Mughal and Persian woodwork.", category: "religious" },
      { name: "Hushe Valley", blurb: "The road-head village and base camp for K6, K7 and Masherbrum trekkers.", category: "valley" },
      { name: "Shyok River", blurb: "The wide braided river that carves the Khaplu valley below the orchards.", category: "viewpoint" },
      { name: "Saling Valley", blurb: "A quiet green side-valley of terraced fields and apricot orchards.", category: "valley" },
    ],
    tracks: [
      {
        name: "Khaplu → Hushe jeep track",
        blurb: "A long, rough valley road following the Shyok and Hushe rivers to the trekking road-head — loose surface, narrow ledges and stream crossings.",
        bikeNeeded: "150cc+ dual-sport / trail bike, or a 4x4 jeep",
        skill: "advanced",
        warning: "Remote with little fuel or help beyond Khaplu — travel in daylight and carry spares.",
      },
    ],
  },

  shigar: {
    hero: "/photos/destinations/shigar/serena-shigar-fort.jpg",
    tagline: "Apricot orchards and old forts on the road to the Baltoro and K2.",
    gallery: [],
    spots: [
      { name: "Serena Shigar Fort", blurb: "A 17th-century Raja's fort-palace ('Fong Khar') restored as a heritage hotel and museum.", category: "fort" },
      { name: "Blind Lake", blurb: "A calm lake on the valley floor with mirror reflections of the surrounding peaks.", category: "lake" },
      { name: "Amburiq Mosque", blurb: "An ancient wooden mosque showing early Tibetan-Balti Islamic craftsmanship.", category: "religious" },
      { name: "Khilingrong Mosque", blurb: "A centuries-old carved-wood mosque in the heart of Shigar.", category: "religious" },
      { name: "Shigar Valley", blurb: "Green terraced fields and orchards lining the Shigar River below the Karakoram.", category: "valley" },
    ],
  },

  naltar: {
    hero: "/photos/destinations/naltar/naltor-001.jpg",
    tagline: "Pine forests, vivid blue lakes and Pakistan's premier ski slope.",
    gallery: [],
    spots: [
      { name: "Naltar Lakes", blurb: "A cluster of intensely blue-green alpine lakes reached by jeep above Naltar Bala.", category: "lake" },
      { name: "Naltar Ski Resort", blurb: "The Air Force-run ski slope, one of the best in Pakistan.", category: "viewpoint" },
      { name: "Pine Forests", blurb: "Thick conifer forest blanketing the valley — a rarity in the dry north.", category: "valley" },
      { name: "Strawberry Valley", blurb: "A green pocket of the valley known for wild strawberries in summer.", category: "valley" },
    ],
  },

  nooritop: {
    hero: "/photos/destinations/nooritop/noori-top-001.jpg",
    tagline: "A high alpine top with sweeping meadows above the Kaghan Valley.",
    gallery: [],
    spots: [
      { name: "Summit Meadows", blurb: "Wide green pastures at the top with 360° mountain views.", category: "viewpoint" },
      { name: "Malika Parbat View", blurb: "Views toward Malika Parbat, the highest peak of the Kaghan Valley.", category: "viewpoint" },
      { name: "Alpine Camping", blurb: "A popular high-altitude camping spot under clear, star-filled skies.", category: "trek" },
    ],
  },

  raatigali: {
    hero: "/photos/destinations/raatigali/raati-gali-001.jpg",
    tagline: "A glacial alpine lake high above the Neelum Valley.",
    gallery: [],
    spots: [
      { name: "Raati Gali Lake", blurb: "A vivid glacial lake ringed by snowfields above Dawarian, reached by jeep and a short trek.", category: "lake" },
      { name: "Alpine Meadows", blurb: "Wildflower meadows surrounding the lake in midsummer.", category: "valley" },
      { name: "Glacier Streams", blurb: "Icy meltwater streams feeding the lake from the surrounding peaks.", category: "viewpoint" },
    ],
  },

  baboonvalley: {
    hero: "/photos/destinations/baboonvalley/baboon-001.jpg",
    tagline: "A quiet, lesser-known green valley away from the crowds.",
    gallery: [],
    spots: [
      { name: "Valley Meadows", blurb: "Open green pastures and gentle slopes ideal for a relaxed stop.", category: "valley" },
      { name: "Mountain Views", blurb: "Uncrowded views of the surrounding northern peaks.", category: "viewpoint" },
      { name: "Riverside Walks", blurb: "Easy walks along the valley's streams and meadows.", category: "valley" },
    ],
  },

  fairymeadows: {
    hero: "/destinations/fairymeadows.jpg",
    tagline: "A grassy plateau facing the 8,126m face of Nanga Parbat.",
    gallery: [SCENERY.meadow, SCENERY.karakoram, SCENERY.snowLake],
    spots: [
      { name: "Nanga Parbat Base Camp", blurb: "A day trek from the meadows to the foot of the 'Killer Mountain'.", category: "trek" },
      { name: "Beyal Camp", blurb: "A halfway alpine camp on the base-camp trail.", category: "trek" },
      { name: "View Point", blurb: "The classic meadow viewpoint straight onto Nanga Parbat.", category: "viewpoint" },
    ],
    tracks: [
      {
        name: "Raikot Jeep Track",
        blurb: "Often called one of the world's most dangerous roads — a narrow, crumbling cliff track from Raikot Bridge to Tato, then a steep walk.",
        bikeNeeded: "Specialist 4x4 jeeps only — bikes are not advised",
        skill: "expert",
        warning: "Use the local jeep service; the track is too narrow and exposed for self-driving or riding.",
      },
    ],
  },

  deosai: {
    hero: "/destinations/deosai.jpg",
    tagline: "The 'Land of Giants' — the world's second-highest plateau.",
    gallery: [SCENERY.meadow, SCENERY.snowLake, SCENERY.greenValley],
    spots: [
      { name: "Sheosar Lake", blurb: "A high, mirror-still lake at ~4,142m ringed by wildflowers.", category: "lake" },
      { name: "Bara Pani", blurb: "A river-crossing campsite in the middle of the plains.", category: "valley" },
      { name: "Wildflower Plains", blurb: "Endless summer meadows that bloom across the plateau in July.", category: "valley" },
      { name: "Himalayan Brown Bear", blurb: "Deosai National Park protects the rare Himalayan brown bear.", category: "wildlife" },
    ],
    tracks: [
      {
        name: "Deosai plateau crossing",
        blurb: "The unpaved traverse between Skardu and Astore across the high plains — river fords, mud and ~4,000m altitude.",
        bikeNeeded: "250cc+ adventure bike or a 4x4, with extra fuel",
        skill: "expert",
        warning: "No fuel, food or signal for hours; only attempt in a group in clear weather.",
      },
    ],
  },

  khunjerab: {
    hero: "/destinations/khunjerab.jpg",
    tagline: "The highest paved border crossing on earth, at 4,693m.",
    gallery: [SCENERY.karakoram, SCENERY.snowLake, SCENERY.attabad],
    spots: [
      { name: "Pak-China Border", blurb: "The dramatic border gate and marker at the top of the Khunjerab Pass.", category: "viewpoint" },
      { name: "Khunjerab National Park", blurb: "Home to ibex, blue sheep, marmots and the elusive snow leopard.", category: "wildlife" },
      { name: "Passu Glacier", blurb: "A vast glacier tongue easily seen from the Karakoram Highway.", category: "glacier" },
      { name: "Borith Lake", blurb: "A small high lake near Passu, a stop for migratory birds.", category: "lake" },
      { name: "Sost", blurb: "The last Pakistani town and dry-port before the pass.", category: "town" },
    ],
  },

  panjpeer: {
    hero: "/destinations/panjpeer/hero.jpg",
    tagline: "A sandstone ridge and sunrise hike on the Potohar Plateau.",
    gallery: [
      "/destinations/panjpeer/narh-waterfall.jpg",
      "/destinations/panjpeer/viewpoint.jpg",
      "/destinations/panjpeer/hero.jpg",
    ],
    spots: [
      { name: "Sunrise Viewpoint", blurb: "The cliff-edge ridge is famous for sunrise above a sea of clouds — the reason most people hike up.", category: "viewpoint" },
      { name: "Narh Waterfall", blurb: "A scenic waterfall near Panjpeer — a refreshing stop to pair with the ridge hike.", category: "viewpoint" },
      { name: "Sandstone Boulders", blurb: "Wind- and rain-sculpted rocks named for five Sufi saints ('panj peer').", category: "viewpoint" },
      { name: "Ridge Hike", blurb: "A short but steep 1–2 hour climb from the Narar / Phagwari trailhead near Kotli Sattian.", category: "trek" },
      { name: "Camping", blurb: "A popular spot to camp overnight and catch the dawn from the top.", category: "valley" },
    ],
  },

  rawalakot: {
    hero: "/destinations/rawalakot.jpg",
    tagline: "Pine ridges, Banjosa Lake and the meadows of Pearl Valley.",
    gallery: [SCENERY.greenValley, SCENERY.meadow, SCENERY.snowLake],
    spots: [
      { name: "Banjosa Lake", blurb: "A calm, pine-ringed lake about 18 km from Rawalakot — boating, picnics and a quiet resort.", category: "lake" },
      { name: "Toli Pir", blurb: "A 2,400m ridge-top shrine and viewpoint, often standing above the clouds.", category: "viewpoint" },
      { name: "Sudhan Gali", blurb: "A green forested pass on the way to Bagh and the gateway to Ganga Choti.", category: "valley" },
      { name: "Tatta Pani", blurb: "Natural hot springs beside the Poonch river.", category: "viewpoint" },
      { name: "Ganga Choti", blurb: "A popular summit hike above Bagh with panoramic Kashmir views.", category: "trek" },
    ],
  },

  dudipatsar: {
    hero: "/photos/destinations/dudipatsar/dudipatsar-001.jpg",
    tagline: "A 3,800m emerald lake ringed by snow peaks above the Kaghan Valley.",
    gallery: [
      "/photos/destinations/dudipatsar/dudipatsar-001.jpg",
      "/photos/destinations/dudipatsar/dudipatsar-002.jpg",
      "/photos/destinations/dudipatsar/dudipatsar-003.jpg",
    ],
    spots: [
      { name: "Dudipatsar Lake", blurb: "A deep emerald glacial lake at ~3,800m, ringed by snow-streaked peaks — the centrepiece of the trek.", category: "lake" },
      { name: "Besal", blurb: "The roadhead camp on the Naran–Babusar road where the jeep ride ends and the trek begins.", category: "town" },
      { name: "Wildflower Meadows", blurb: "The trail climbs through alpine meadows carpeted with summer wildflowers along the Pursra stream.", category: "valley" },
      { name: "Alpine Trek", blurb: "A steep 4–6 hour day-trek from Besal — moderately tough and best in clear weather.", category: "trek" },
    ],
  },

  broghil: {
    hero: "/photos/destinations/broghil/broghil-001.jpg",
    tagline: "Yak pastures and Wakhi villages on the remote Afghan Pamir border.",
    gallery: [
      "/photos/destinations/broghil/broghil-001.jpg",
      "/photos/destinations/broghil/broghil-002.jpg",
      "/photos/destinations/broghil/broghil-003.jpg",
    ],
    spots: [
      { name: "Karombar Lake", blurb: "One of the world's highest lakes (~4,300m) — a vivid blue sheet on the Broghil–Ishkoman watershed.", category: "lake" },
      { name: "Qalandar Uween Lake", blurb: "A serene high-altitude lake amid the Broghil wetlands and yak pastures.", category: "lake" },
      { name: "Yak Pastures", blurb: "Vast summer grazing meadows where Wakhi herders bring their yak herds.", category: "valley" },
      { name: "Wakhi Villages", blurb: "Scattered stone-and-mud hamlets of the Wakhi people, among Pakistan's most isolated communities.", category: "town" },
      { name: "Broghil Pass", blurb: "The 3,800m pass into the Afghan Wakhan corridor — historic gateway across the Hindu Kush.", category: "viewpoint" },
    ],
  },

  shimshal: {
    hero: "/photos/destinations/shimshal/shimshal-001.jpg",
    tagline: "Hunza's highest village and a mountaineers' road carved into cliffs.",
    gallery: [
      "/photos/destinations/shimshal/shimshal-001.jpg",
      "/photos/destinations/shimshal/shimshal-002.jpg",
      "/photos/destinations/shimshal/shimshal-003.jpg",
    ],
    spots: [
      { name: "Shimshal Village", blurb: "A 3,100m Wakhi village famed for producing many of Pakistan's top high-altitude climbers.", category: "town" },
      { name: "Cliff Jeep Road", blurb: "The dramatic ~50km track from the KKH, hand-cut into sheer gorge walls — a white-knuckle drive.", category: "viewpoint" },
      { name: "Shimshal Pass", blurb: "A high summer-pasture plateau (~4,700m) of lakes and grazing grounds, a multi-day trek above the village.", category: "trek" },
      { name: "Pamir Pastures", blurb: "Wide alpine pastures where Shimshali families graze yaks and sheep through the summer.", category: "valley" },
      { name: "Minglik Sar Views", blurb: "The trek base for the 6,050m Minglik Sar — a popular first 6,000m climb.", category: "viewpoint" },
    ],
  },

  // --- Added 2026-06 (guide content for the "New Destinations" drop) ----------
  balakot: {
    hero: "/photos/destinations/balakot/balakot.jpg",
    tagline: "Riverside gateway to the Kaghan Valley.",
    gallery: [SCENERY.greenValley, SCENERY.riverBridge],
    spots: [
      { name: "Kunhar River", blurb: "The roaring blue-green river the town sits beside — riverside cafés and fresh trout.", category: "valley" },
      { name: "Demanchi", blurb: "A green ridge viewpoint above Balakot with sweeping views over the valley.", category: "viewpoint" },
      { name: "Balakot Bazaar", blurb: "The busy gateway bazaar — your last big stock-up before the climb up the Kaghan road.", category: "town" },
      { name: "Kiwai", blurb: "A popular roadside waterfall stop just up the Kaghan road, famous for trout and pakoras.", category: "viewpoint" },
    ],
  },

  batakundi: {
    hero: "/photos/destinations/batakundi/batakundi.jpg",
    tagline: "Alpine hamlet past Naran on the road to Babusar.",
    gallery: [SCENERY.meadow, SCENERY.greenValley],
    spots: [
      { name: "Batakundi Village", blurb: "A quiet riverside hamlet ~16km past Naran, lined with hotels and pine slopes.", category: "town" },
      { name: "Burawai", blurb: "The next stop up the Kunhar toward Babusar — trout farms and camping spots.", category: "valley" },
      { name: "Lalazar Plateau", blurb: "A flower-carpeted plateau above Batakundi with views toward Malika Parbat.", category: "viewpoint" },
      { name: "Kunhar River", blurb: "Fast, ice-cold glacial water running the length of the valley — great for riverside camps.", category: "valley" },
    ],
  },

  battagram: {
    hero: "/photos/destinations/battagram/battagram.jpg",
    tagline: "A green Karakoram Highway valley below the Allai hills.",
    gallery: [SCENERY.greenValley, SCENERY.riverBridge],
    spots: [
      { name: "Battagram Valley", blurb: "A green district-town valley strung along the KKH — a handy stopover heading north.", category: "valley" },
      { name: "Allai Valley", blurb: "A forested side valley of terraced fields and pine ridges east of the highway.", category: "valley" },
      { name: "Thakot Bridge", blurb: "The landmark Karakoram Highway bridge over the Indus, just north of Battagram.", category: "viewpoint" },
      { name: "Karakoram Highway", blurb: "The legendary N-35 corridor — the lifeline road threading up toward Gilgit-Baltistan.", category: "town" },
    ],
  },

  goldenvalley: {
    hero: "/photos/destinations/goldenvalley/golden-valley.jpg",
    tagline: "The remote Golen (Golden) valley above Chitral.",
    gallery: [SCENERY.greenValley, SCENERY.karakoram],
    spots: [
      { name: "Golen Gol", blurb: "A jeep-track wilderness of glacier streams and high pasture branching off the Mastuj road.", category: "valley" },
      { name: "Chitral Gol National Park", blurb: "A markhor reserve of alpine forest and meadows right beside Chitral town.", category: "wildlife" },
      { name: "Koghuzi Turnoff", blurb: "The village where the rough jeep track leaves the main road into the Golen valley.", category: "town" },
      { name: "Glacier Streams", blurb: "Milky meltwater channels and small falls feeding the valley's hydropower.", category: "valley" },
    ],
  },

  haramosh: {
    hero: "/photos/destinations/haramosh/haramosh-valley.jpg",
    tagline: "Glacier-walled valley of Kutwal Lake below Haramosh Peak.",
    gallery: [SCENERY.snowLake, SCENERY.karakoram],
    spots: [
      { name: "Kutwal Lake", blurb: "A jewel-blue alpine lake at the valley head, ringed by glaciers — a tough trek beyond Sassi.", category: "lake" },
      { name: "Haramosh Peak", blurb: "The valley's 7,409m guardian, one of the great Karakoram giants.", category: "viewpoint" },
      { name: "Dobani Peak", blurb: "A striking pyramid peak (~6,100m) towering over the lower valley.", category: "viewpoint" },
      { name: "Khaltaro Valley", blurb: "A quiet side valley of meadows and villages branching off Haramosh.", category: "valley" },
      { name: "Laila Peak", blurb: "A slender, much-photographed spire seen on the trek toward Kutwal.", category: "viewpoint" },
    ],
  },

  ishkoman: {
    hero: "/photos/destinations/ishkoman/ishkoman-valley.jpg",
    tagline: "A long Ghizer valley climbing toward Karambar Lake.",
    gallery: [SCENERY.turquoise, SCENERY.greenValley],
    spots: [
      { name: "Karambar Lake", blurb: "One of the world's highest large lakes (~4,300m) at the valley's remote head.", category: "lake" },
      { name: "Ishkoman Village", blurb: "The green main settlement of the valley, a base for treks toward the Afghan frontier.", category: "town" },
      { name: "Ghizer River", blurb: "The trout-rich river threading the valley, lined with poplar and farmland.", category: "valley" },
      { name: "Phakora", blurb: "A pretty roadside hamlet and lake on the way up the Ishkoman valley.", category: "valley" },
    ],
  },

  lowaritop: {
    hero: "/photos/destinations/lowaritop/lowari-pass.jpg",
    tagline: "The snow-prone pass between Dir and Chitral.",
    gallery: [SCENERY.karakoram, SCENERY.meadow],
    spots: [
      { name: "Lowari Pass Top", blurb: "The 3,118m summit of the old pass — green meadows in summer, snow-buried in winter.", category: "viewpoint" },
      { name: "Lowari Tunnel", blurb: "The long all-weather tunnel below the pass that now keeps Chitral connected year-round.", category: "town" },
      { name: "Switchback Road", blurb: "The dramatic zig-zag climb of the old top road, a favourite for riders and photographers.", category: "viewpoint" },
      { name: "Summit Viewpoint", blurb: "Panoramas back over Dir's forests and ahead toward the Chitral valley.", category: "viewpoint" },
    ],
  },

  nakyal: {
    hero: "/photos/destinations/nakyal/nakyal.jpg",
    tagline: "A green hill tehsil of Kotli near the Line of Control.",
    gallery: [SCENERY.greenValley, SCENERY.meadow],
    spots: [
      { name: "Nakyal Bazaar", blurb: "The lively main bazaar of the tehsil, set among terraced hills.", category: "town" },
      { name: "Fatehpur Thakyala", blurb: "A nearby town of green ridges and farmland close to the LoC.", category: "town" },
      { name: "Forested Ridges", blurb: "Pine-clad hills and walking trails around the valley, cool even in summer.", category: "viewpoint" },
      { name: "LoC Viewpoints", blurb: "High points looking across the Line of Control — keep your CNIC handy near check-posts.", category: "viewpoint" },
    ],
  },

  siranvalley: {
    hero: "/photos/destinations/siranvalley/siran-valley.jpg",
    tagline: "An off-the-radar pine valley on the Siran River.",
    gallery: [SCENERY.greenValley, SCENERY.meadow],
    spots: [
      { name: "Siran Waterfall", blurb: "A pretty forest waterfall, the valley's best-known stop for a cool break.", category: "viewpoint" },
      { name: "Khanda Gali", blurb: "A forested ridge / gali with panoramic views over the Siran and Kaghan country.", category: "viewpoint" },
      { name: "Forest of Jacha", blurb: "Thick pine and fir forest above the river — quiet picnic and camping ground.", category: "valley" },
      { name: "Chorr Khanda Gali", blurb: "A gentle trek through meadows and woods to a high gali viewpoint.", category: "trek" },
    ],
  },

  thuipass: {
    hero: "/photos/destinations/thuipass/thui-pass.jpg",
    tagline: "A high Hindu Kush pass linking Yarkhun and Ishkoman.",
    gallery: [SCENERY.snowLake, SCENERY.karakoram],
    spots: [
      { name: "Thui Pass", blurb: "A remote ~4,500m trekking pass over the Hindu Kush divide — for experienced, guided trekkers only.", category: "trek" },
      { name: "Bari Lake", blurb: "An icy alpine lake near the pass, a classic high camp on the crossing.", category: "lake" },
      { name: "Yarkhun Valley", blurb: "The upper Chitral valley of stone villages and yak pastures on the Thui's western approach.", category: "valley" },
      { name: "Yarkhun Lasht", blurb: "Wide high pastures at the head of the Yarkhun, the staging ground for the trek.", category: "valley" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Hotel listings (placeholder — admin-managed later). All <= 2500 PKR / night.
// ---------------------------------------------------------------------------
const ROOMS = [
  "/hotels/room1.jpg",
  "/hotels/room2.jpg",
  "/hotels/room3.jpg",
  "/hotels/room4.jpg",
  "/hotels/room5.jpg",
  "/hotels/room6.jpg",
];

interface HotelSeed {
  dest: string;
  name: string;
  area: string;
  price: number;
  rating: number;
  amenities: string[];
}

const HOTEL_SEEDS: HotelSeed[] = [
  { dest: "murree", name: "Pine View Guest House", area: "Mall Road", price: 2400, rating: 4.2, amenities: ["Wi-Fi", "Hot water", "Parking", "Mountain view"] },
  { dest: "murree", name: "Galyat Budget Inn", area: "Kashmir Point", price: 1800, rating: 3.9, amenities: ["Hot water", "Room heater", "Breakfast"] },
  { dest: "nathiagali", name: "Cedarwood Lodge", area: "Nathia Gali Bazaar", price: 2500, rating: 4.3, amenities: ["Forest view", "Hot water", "Bonfire", "Parking"] },
  { dest: "nathiagali", name: "Greenhills Rooms", area: "Dunga Gali", price: 2000, rating: 3.8, amenities: ["Hot water", "Breakfast", "Room heater"] },
  { dest: "naran", name: "Kunhar River Lodge", area: "Naran Bazaar", price: 2500, rating: 4.1, amenities: ["River view", "Hot water", "Restaurant", "Parking"] },
  { dest: "naran", name: "Kaghan Camp & Rooms", area: "Naran", price: 1500, rating: 3.7, amenities: ["Camping", "Bonfire", "Shared kitchen"] },
  { dest: "swat", name: "Kalam Riverside Inn", area: "Kalam", price: 2400, rating: 4.2, amenities: ["River view", "Wi-Fi", "Restaurant", "Parking"] },
  { dest: "swat", name: "Bahrain Trout House", area: "Bahrain", price: 1900, rating: 3.9, amenities: ["River view", "Trout meals", "Hot water"] },
  { dest: "neelum", name: "Sharda Valley Cottages", area: "Sharda", price: 2300, rating: 4.0, amenities: ["River view", "Bonfire", "Hot water", "Parking"] },
  { dest: "neelum", name: "Keran Riverside Camp", area: "Keran", price: 1600, rating: 3.8, amenities: ["River view", "Camping", "Breakfast"] },
  { dest: "gorakh", name: "Gorakh Hill Cottages", area: "Plateau", price: 2200, rating: 3.6, amenities: ["Heater", "Bonfire", "Stargazing deck"] },
  { dest: "gorakh", name: "Sunset Point Camp", area: "Sunset Point", price: 1200, rating: 3.5, amenities: ["Camping", "Bonfire", "Shared kitchen"] },
  { dest: "hunza", name: "Karimabad Eagle View", area: "Karimabad", price: 2500, rating: 4.5, amenities: ["Rakaposhi view", "Wi-Fi", "Restaurant", "Terrace"] },
  { dest: "hunza", name: "Altit Orchard Guest House", area: "Altit", price: 2200, rating: 4.3, amenities: ["Orchard", "Hot water", "Breakfast", "Parking"] },
  { dest: "skardu", name: "Shangrila Road Inn", area: "Skardu town", price: 2500, rating: 4.2, amenities: ["Wi-Fi", "Restaurant", "Hot water", "Parking"] },
  { dest: "skardu", name: "Katpana Desert Camp", area: "Katpana", price: 1800, rating: 4.0, amenities: ["Desert view", "Camping", "Bonfire", "Breakfast"] },
  { dest: "gilgit", name: "Gilgit City Lodge", area: "Gilgit", price: 2300, rating: 4.0, amenities: ["Wi-Fi", "Restaurant", "Hot water", "Parking"] },
  { dest: "gilgit", name: "Naltar Valley Rooms", area: "Naltar", price: 1700, rating: 3.8, amenities: ["Forest view", "Hot water", "Breakfast"] },
  { dest: "chitral", name: "Chitral Fort View", area: "Chitral town", price: 2400, rating: 4.1, amenities: ["River view", "Restaurant", "Hot water", "Parking"] },
  { dest: "chitral", name: "Kalash Valley Guest House", area: "Bumburet", price: 2000, rating: 4.0, amenities: ["Valley view", "Breakfast", "Cultural tours"] },
  { dest: "astore", name: "Rama Meadows Lodge", area: "Rama", price: 2300, rating: 4.0, amenities: ["Meadow view", "Bonfire", "Hot water"] },
  { dest: "astore", name: "Astore Valley Inn", area: "Astore town", price: 1800, rating: 3.7, amenities: ["Hot water", "Breakfast", "Parking"] },
  { dest: "fairymeadows", name: "Fairy Meadows Cabins", area: "The meadows", price: 2500, rating: 4.4, amenities: ["Nanga Parbat view", "Bonfire", "Restaurant"] },
  { dest: "fairymeadows", name: "Raikot Base Camp Tents", area: "Tato", price: 1600, rating: 3.9, amenities: ["Camping", "Bonfire", "Guide service"] },
  { dest: "deosai", name: "Deosai Plains Camp", area: "Bara Pani", price: 2200, rating: 3.8, amenities: ["Plateau view", "Full-board camping", "Bonfire"] },
  { dest: "deosai", name: "Sheosar Lake Tents", area: "Sheosar", price: 1900, rating: 3.7, amenities: ["Lake view", "Camping", "Meals included"] },
  { dest: "khunjerab", name: "Sost Border Inn", area: "Sost", price: 2300, rating: 3.9, amenities: ["Wi-Fi", "Restaurant", "Hot water", "Parking"] },
  { dest: "khunjerab", name: "Passu Cones Guest House", area: "Passu", price: 2100, rating: 4.2, amenities: ["Passu Cones view", "Breakfast", "Hot water"] },
  { dest: "panjpeer", name: "Panjpeer Base Camp", area: "Narar trailhead", price: 1500, rating: 3.8, amenities: ["Camping", "Bonfire", "Guide service"] },
  { dest: "panjpeer", name: "Kotli Sattian Rest House", area: "Kotli Sattian", price: 2000, rating: 3.7, amenities: ["Hot water", "Parking", "Breakfast"] },
  { dest: "rawalakot", name: "Banjosa Lake Resort", area: "Banjosa", price: 2500, rating: 4.2, amenities: ["Lake view", "Restaurant", "Bonfire", "Parking"] },
  { dest: "rawalakot", name: "Pearl Valley Inn", area: "Rawalakot", price: 1900, rating: 3.9, amenities: ["Wi-Fi", "Hot water", "Breakfast"] },
];

export const HOTELS: HotelListing[] = HOTEL_SEEDS.map((h, i) => ({
  id: `${h.dest}-${i}`,
  destinationId: h.dest,
  name: h.name,
  photo: ROOMS[i % ROOMS.length],
  pricePerNight: h.price,
  area: h.area,
  amenities: h.amenities,
  rating: h.rating,
}));

export function hotelsFor(destinationId: string): HotelListing[] {
  return HOTELS.filter((h) => h.destinationId === destinationId);
}

export function contentFor(destinationId: string): DestinationContent | undefined {
  return CONTENT[destinationId];
}

// ---------------------------------------------------------------------------
// En-route stops — the classic approach corridor for each destination.
// Ordered from the gateway city toward the destination, with what to see /
// why stop. (Most northern trips funnel through Islamabad/Rawalpindi; coastal
// and Sindh trips start from Karachi.)
// ---------------------------------------------------------------------------
export interface RouteStop {
  name: string;
  note: string;
}

export const EN_ROUTE: Record<string, RouteStop[]> = {
  murree: [
    { name: "Islamabad", note: "Gateway city — fuel up and grab supplies before the climb." },
    { name: "Charra Pani", note: "First pine-clad bends on the expressway, popular for roadside corn and tea." },
    { name: "Murree (Mall Road)", note: "You've arrived — park and walk the Mall." },
  ],
  nathiagali: [
    { name: "Murree", note: "Pass through or stop at Mall Road on the way up." },
    { name: "Ayubia", note: "Ride the chairlift and walk the famous Pipeline Track." },
    { name: "Dunga Gali", note: "Cool forest village right before Nathia Gali." },
  ],
  panjpeer: [
    { name: "Kahuta", note: "Last proper town for fuel and snacks." },
    { name: "Kotli Sattian", note: "Green hill town on the winding climb up." },
    { name: "Narar trailhead", note: "Leave the car here and start the 1–2 hour hike." },
  ],
  naran: [
    { name: "Abbottabad", note: "Big town for a meal and fuel before the mountains." },
    { name: "Balakot", note: "Gateway to Kaghan, on the Kunhar river." },
    { name: "Kaghan", note: "Small bazaar village; the valley narrows from here." },
    { name: "Naran", note: "Base for Saif-ul-Malook and Babusar Top." },
  ],
  swat: [
    { name: "Mardan", note: "Last major city; fuel and food before the hills." },
    { name: "Malakand Pass", note: "Historic pass with sweeping views into Swat." },
    { name: "Mingora", note: "Swat's main town — markets and the museum." },
    { name: "Bahrain", note: "Riverside bazaar known for handicrafts and trout." },
    { name: "Kalam", note: "The scenic heart of upper Swat." },
  ],
  neelum: [
    { name: "Muzaffarabad", note: "AJK's capital — stock up before entering the valley." },
    { name: "Keran", note: "Riverside village facing the Neelum across the water." },
    { name: "Sharda", note: "Ancient Sharda ruins and a popular halt." },
    { name: "Kel / Arang Kel", note: "Chairlift up to the storybook meadow village." },
  ],
  rawalakot: [
    { name: "Azad Pattan", note: "Cross the Jhelum into Azad Kashmir here." },
    { name: "Rawalakot", note: "The Pearl Valley town — base for the area." },
    { name: "Banjosa Lake", note: "Pine-ringed lake, ~18 km on for boating and picnics." },
  ],
  gorakh: [
    { name: "Sehwan Sharif", note: "Famous Sufi shrine worth a stop on the way." },
    { name: "Johi / Wahi Pandhi", note: "Last town for fuel before the mountain track." },
    { name: "Gorakh plateau", note: "The winding climb tops out at the cool plateau." },
  ],
  hunza: [
    { name: "Besham", note: "Classic overnight halt on the Karakoram Highway." },
    { name: "Chilas", note: "Hot, low town — a common second-day stop." },
    { name: "Gilgit", note: "Regional hub; last big bazaar before Hunza." },
    { name: "Rakaposhi View Point", note: "Roadside terrace facing the 7,788m giant." },
    { name: "Karimabad", note: "Hunza's heart, below Baltit Fort." },
  ],
  skardu: [
    { name: "Chilas", note: "On the KKH before the Skardu turn-off." },
    { name: "Jaglot", note: "Junction where the Skardu Road leaves the KKH." },
    { name: "Skardu Road (Indus gorge)", note: "A spectacular cliff road along the Indus." },
    { name: "Skardu", note: "Gateway to the Karakoram lakes and deserts." },
  ],
  gilgit: [
    { name: "Besham", note: "Riverside halt on the Karakoram Highway." },
    { name: "Chilas", note: "Common overnight stop on the long KKH drive." },
    { name: "Jaglot", note: "Nanga Parbat view point near the rivers' junction." },
    { name: "Gilgit", note: "The bustling hub of the north." },
  ],
  chitral: [
    { name: "Timergara / Dir", note: "Last towns before the big climb." },
    { name: "Lowari Tunnel", note: "The 8.5 km tunnel under the Lowari Pass." },
    { name: "Drosh", note: "First Chitral-district town after the tunnel." },
    { name: "Chitral", note: "Riverside town below Tirich Mir." },
  ],
  astore: [
    { name: "Jaglot", note: "Turn off the KKH toward the Astore valley." },
    { name: "Astore town", note: "Main town and supplies for the valley." },
    { name: "Rama", note: "Meadows and lake below Nanga Parbat." },
  ],
  fairymeadows: [
    { name: "Chilas", note: "Nearest town on the KKH." },
    { name: "Raikot Bridge", note: "Swap to a local jeep for the famous track." },
    { name: "Tato village", note: "Jeep ends here; the trek begins." },
    { name: "Fairy Meadows", note: "A 2–3 hour walk up to the plateau." },
  ],
  deosai: [
    { name: "Sadpara Lake", note: "Above Skardu on the way up to the plains." },
    { name: "Deosai entrance", note: "Climb onto the ~4,000m plateau." },
    { name: "Bara Pani", note: "River-crossing campsite in the middle of the plains." },
    { name: "Sheosar Lake", note: "The high mirror-lake at the far side." },
  ],
  khunjerab: [
    { name: "Karimabad (Hunza)", note: "Usual base before the final push north." },
    { name: "Passu", note: "The Passu Cones and glacier views." },
    { name: "Sost", note: "Last town and immigration/dry-port before the pass." },
    { name: "Khunjerab Pass", note: "The 4,693m Pak-China border." },
  ],
};

export function enRouteFor(destinationId: string): RouteStop[] {
  return EN_ROUTE[destinationId] ?? [];
}
