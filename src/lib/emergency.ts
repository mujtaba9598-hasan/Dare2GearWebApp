// Dare2Gear — per-destination emergency & roadside-help contacts.
// ---------------------------------------------------------------------------
// SAFETY: every number here must be REAL. The universal lines — Rescue 1122,
// Police 15, Edhi ambulance 115 — work nationwide from any phone with signal.
// Named hospital / police direct numbers are added ONLY when verified from an
// official or strongly-corroborated source (researched 2026-06). Numbers tagged
// `// verify` below are medium-confidence (third-party directories) and should be
// re-confirmed by a live call before being fully relied on. Informal puncture &
// mechanic shops almost never publish a number, so we point to the nearest town /
// bazaar where they exist instead of inventing one.
//
// OFFLINE: this data is statically baked into each destination page, so once a
// page has loaded the numbers are visible (and callable) without any network.
// ---------------------------------------------------------------------------

export interface EmergencyContact {
  /** Place / facility name — always shown. */
  name: string;
  /** Verified phone number, if one genuinely exists. Omitted, never guessed. */
  phone?: string;
}

export interface DestinationEmergency {
  police: EmergencyContact;
  hospital: EmergencyContact;
  /** Nearest puncture-repair shop / bazaar. */
  puncture: EmergencyContact;
  /** Nearest mechanic / workshop. */
  mechanic: EmergencyContact;
  /** Disaster & medical rescue line — national 1122. */
  rescue: string;
  /** Optional caveat (e.g. remote area where 1122 / signal may not reach). */
  note?: string;
}

const RESCUE = "1122"; // national rescue & emergency service
const POLICE = "15"; // nationwide police emergency

/** Universal lines shown on every destination (24/7, no SIM balance needed). */
export const UNIVERSAL_LINES: { label: string; phone: string }[] = [
  { label: "Rescue 1122", phone: "1122" },
  { label: "Police", phone: "15" },
  { label: "Edhi Ambulance", phone: "115" },
];

/** Fallback so every destination always shows the universal lines. */
export const DEFAULT_EMERGENCY: DestinationEmergency = {
  police: { name: "Police emergency", phone: POLICE },
  hospital: { name: "Nearest DHQ / civil hospital" },
  puncture: { name: "Nearest town bazaar" },
  mechanic: { name: "Nearest town workshop" },
  rescue: RESCUE,
};

const REMOTE_NOTE =
  "Remote area — mobile signal and Rescue 1122 coverage can be patchy. Carry a basic repair kit, spare tube and a power bank, and save these numbers before you lose signal.";
const NO_1122_NOTE =
  "No formal local Rescue 1122 station in this district — dial 1122 anyway, but the nearest response is via Muzaffarabad. Use the hospital line and 15 (police) as backups.";

export const EMERGENCY: Record<string, DestinationEmergency> = {
  // ---- Gilgit-Baltistan (Rescue 1122 operates GB-wide) ---------------------
  fairymeadows: {
    police: { name: "Chilas Police (Diamer)", phone: POLICE },
    hospital: { name: "RHQ Hospital Chilas (Diamer health office)", phone: "05812-920024" }, // verify
    puncture: { name: "Raikot Bridge" },
    mechanic: { name: "Raikot / Chilas bazaar" },
    rescue: RESCUE,
    note: "Reached on foot/jeep above Raikot — no services past Tatu village and weak signal on the meadow. " + REMOTE_NOTE,
  },
  astore: {
    police: { name: "Astore Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Astore (Eidgah)" },
    puncture: { name: "Astore / Eidgah bazaar" },
    mechanic: { name: "Astore bazaar" },
    rescue: RESCUE,
    note: REMOTE_NOTE,
  },
  gilgit: {
    police: { name: "Gilgit City Police", phone: POLICE },
    hospital: { name: "DHQ / RHQ Hospital Gilgit", phone: "05811-920253" },
    puncture: { name: "Gilgit bazaar (Airport Rd)" },
    mechanic: { name: "Gilgit (Jutial / NLI Chowk)" },
    rescue: RESCUE,
  },
  naltar: {
    police: { name: "Nomal / Gilgit Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Gilgit", phone: "05811-920253" },
    puncture: { name: "Nomal village" },
    mechanic: { name: "Gilgit" },
    rescue: RESCUE,
    note: "Rough jeep track from Nomal up to Naltar — fix anything major in Gilgit first. " + REMOTE_NOTE,
  },
  baboonvalley: {
    police: { name: "Gilgit Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Gilgit", phone: "05811-920253" },
    puncture: { name: "Gilgit / nearest KKH stop" },
    mechanic: { name: "Gilgit" },
    rescue: RESCUE,
    note: REMOTE_NOTE,
  },
  haramosh: {
    police: { name: "Sassi / Gilgit Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Gilgit", phone: "05811-920253" },
    puncture: { name: "Sassi (on the KKH)" },
    mechanic: { name: "Gilgit" },
    rescue: RESCUE,
    note: "Kutwal Lake is a trek beyond Sassi — no road services in the upper valley. " + REMOTE_NOTE,
  },
  hunza: {
    police: { name: "Aliabad Police (Hunza)", phone: POLICE },
    hospital: { name: "DHQ Hospital / AKHS Centre, Aliabad", phone: "05813-455495" }, // verify
    puncture: { name: "Aliabad / Karimabad" },
    mechanic: { name: "Aliabad bazaar" },
    rescue: RESCUE,
  },
  khunjerab: {
    police: { name: "Sost Police", phone: POLICE },
    hospital: { name: "AKHS Aliabad / RHC Sost", phone: "05813-455495" }, // verify
    puncture: { name: "Sost" },
    mechanic: { name: "Sost / Gulmit" },
    rescue: RESCUE,
    note: "The pass (4,693m) has no services and thin air — top up fuel and check tyres at Sost. " + REMOTE_NOTE,
  },
  shimshal: {
    police: { name: "Gulmit / Passu Police", phone: POLICE },
    hospital: { name: "AKHS / DHQ Aliabad, Hunza", phone: "05813-455495" }, // verify
    puncture: { name: "Passu / Gulmit" },
    mechanic: { name: "Aliabad" },
    rescue: RESCUE,
    note: "The cliff jeep road has zero services — carry spares; fix everything in Aliabad/Passu first. " + REMOTE_NOTE,
  },
  ishkoman: {
    police: { name: "Gahkuch Police (Ghizer)", phone: POLICE },
    hospital: { name: "DHQ Hospital Gahkuch" },
    puncture: { name: "Chatorkhand / Gahkuch" },
    mechanic: { name: "Gahkuch" },
    rescue: RESCUE,
    note: REMOTE_NOTE,
  },
  thuipass: {
    police: { name: "Gahkuch / Imit Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Gahkuch" },
    puncture: { name: "Imit (road-head)" },
    mechanic: { name: "Gahkuch" },
    rescue: RESCUE,
    note: "Thui is a high trekking pass with no road or services — go guided and self-sufficient. " + REMOTE_NOTE,
  },
  skardu: {
    police: { name: "Skardu Police", phone: POLICE },
    hospital: { name: "DHQ / RHQ Hospital Skardu", phone: "05815-921014" }, // verify (regional health office)
    puncture: { name: "Skardu bazaar" },
    mechanic: { name: "Skardu (Naya Bazaar)" },
    rescue: RESCUE,
  },
  shigar: {
    police: { name: "Shigar / Skardu Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Skardu", phone: "05815-921014" }, // verify
    puncture: { name: "Shigar / Skardu bazaar" },
    mechanic: { name: "Skardu" },
    rescue: RESCUE,
  },
  deosai: {
    police: { name: "Skardu Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Skardu", phone: "05815-921014" }, // verify
    puncture: { name: "Skardu / Sadpara (before the plateau)" },
    mechanic: { name: "Skardu" },
    rescue: RESCUE,
    note: "Deosai is uninhabited wilderness (~4,000m) with no fuel, services or reliable signal. " + REMOTE_NOTE,
  },
  khaplu: {
    police: { name: "Khaplu Police (Ghanche)", phone: POLICE },
    hospital: { name: "DHQ Hospital Khaplu", phone: "05816-920156" }, // verify
    puncture: { name: "Khaplu bazaar" },
    mechanic: { name: "Khaplu / Skardu" },
    rescue: RESCUE,
  },

  // ---- KPK (Rescue 1122 operates in all these districts) -------------------
  naran: {
    police: { name: "Naran Police Post", phone: POLICE },
    hospital: { name: "RHC Naran / KATH Mansehra", phone: "0997-920094" },
    puncture: { name: "Naran bazaar" },
    mechanic: { name: "Naran / Kawai" },
    rescue: RESCUE,
    note: "Services thin out past Naran toward Babusar. " + REMOTE_NOTE,
  },
  balakot: {
    police: { name: "Balakot Police", phone: POLICE },
    hospital: { name: "THQ Balakot / KATH Mansehra", phone: "0997-920094" },
    puncture: { name: "Balakot bazaar" },
    mechanic: { name: "Balakot bazaar" },
    rescue: RESCUE,
  },
  batakundi: {
    police: { name: "Naran Police Post", phone: POLICE },
    hospital: { name: "RHC Naran / KATH Mansehra", phone: "0997-920094" },
    puncture: { name: "Naran / Batakundi" },
    mechanic: { name: "Naran" },
    rescue: RESCUE,
    note: REMOTE_NOTE,
  },
  dudipatsar: {
    police: { name: "Naran Police Post", phone: POLICE },
    hospital: { name: "RHC Naran / KATH Mansehra", phone: "0997-920094" },
    puncture: { name: "Besal / Naran" },
    mechanic: { name: "Naran" },
    rescue: RESCUE,
    note: "Dudipatsar is a jeep-plus-trek beyond Besal — no services at the lake. " + REMOTE_NOTE,
  },
  nooritop: {
    police: { name: "Naran / Kaghan Police", phone: POLICE },
    hospital: { name: "RHC Naran / KATH Mansehra", phone: "0997-920094" },
    puncture: { name: "Naran" },
    mechanic: { name: "Naran" },
    rescue: RESCUE,
    note: "A tough off-road climb with no services on the top. " + REMOTE_NOTE,
  },
  siranvalley: {
    police: { name: "Mansehra Police (DPO 0997-920110)", phone: POLICE },
    hospital: { name: "King Abdullah Teaching Hospital (KATH), Mansehra", phone: "0997-920094" },
    puncture: { name: "Mansehra / Jabori" },
    mechanic: { name: "Mansehra" },
    rescue: RESCUE,
  },
  battagram: {
    police: { name: "Battagram Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Battagram" },
    puncture: { name: "Battagram bazaar (on the KKH)" },
    mechanic: { name: "Battagram bazaar" },
    rescue: RESCUE,
  },
  nathiagali: {
    police: { name: "Nathia Gali / Abbottabad Police", phone: POLICE },
    hospital: { name: "Ayub Teaching Hospital, Abbottabad", phone: "0992-9311155" },
    puncture: { name: "Nathia Gali bazaar" },
    mechanic: { name: "Abbottabad" },
    rescue: RESCUE,
  },
  swat: {
    police: { name: "Mingora Police (Swat)", phone: POLICE },
    hospital: { name: "Saidu Group of Teaching Hospitals, Mingora", phone: "0946-9240126" },
    puncture: { name: "Mingora / Kalam bazaar" },
    mechanic: { name: "Mingora" },
    rescue: RESCUE,
  },
  chitral: {
    police: { name: "Chitral Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Chitral" },
    puncture: { name: "Chitral bazaar" },
    mechanic: { name: "Chitral bazaar" },
    rescue: RESCUE,
  },
  goldenvalley: {
    police: { name: "Chitral Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Chitral" },
    puncture: { name: "Chitral bazaar" },
    mechanic: { name: "Chitral" },
    rescue: RESCUE,
    note: "Golen Gol is a remote jeep valley — sort repairs in Chitral town first. " + REMOTE_NOTE,
  },
  lowaritop: {
    police: { name: "Dir / Chitral Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Chitral / THQ Dir" },
    puncture: { name: "Drosh / Dir" },
    mechanic: { name: "Dir" },
    rescue: RESCUE,
    note: "Use the Lowari Tunnel in bad weather. " + REMOTE_NOTE,
  },
  broghil: {
    police: { name: "Mastuj / Chitral Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Chitral" },
    puncture: { name: "Mastuj" },
    mechanic: { name: "Mastuj / Chitral" },
    rescue: RESCUE,
    note: "One of the remotest valleys in Pakistan — fully self-sufficient travel only. " + REMOTE_NOTE,
  },

  // ---- Azad Kashmir --------------------------------------------------------
  neelum: {
    police: { name: "Athmuqam Police (Neelum)", phone: POLICE },
    hospital: { name: "DHQ Hospital Athmuqam", phone: "05821-920051" },
    puncture: { name: "Athmuqam / Keran" },
    mechanic: { name: "Athmuqam" },
    rescue: RESCUE,
    note: NO_1122_NOTE,
  },
  raatigali: {
    police: { name: "Dawarian / Athmuqam Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Athmuqam", phone: "05821-920051" },
    puncture: { name: "Dawarian / Kel" },
    mechanic: { name: "Athmuqam" },
    rescue: RESCUE,
    note: "The lake is a jeep-plus-trek above Dawarian — no services on top. " + NO_1122_NOTE,
  },
  pirchinasi: {
    police: { name: "Muzaffarabad Police (SSP 05822-930006)", phone: POLICE },
    hospital: { name: "Abbas Institute of Medical Sciences (AIMS), Muzaffarabad", phone: "0582-2921016" }, // verify
    puncture: { name: "Muzaffarabad" },
    mechanic: { name: "Muzaffarabad" },
    rescue: RESCUE,
  },
  gangachoti: {
    police: { name: "Bagh / Sudhan Gali Police", phone: POLICE },
    hospital: { name: "DHQ Hospital Bagh", phone: "05823-920079" },
    puncture: { name: "Sudhan Gali / Bagh" },
    mechanic: { name: "Bagh" },
    rescue: RESCUE,
    note: NO_1122_NOTE,
  },
  rawalakot: {
    police: { name: "Rawalakot Police (Poonch)", phone: POLICE },
    hospital: { name: "DHQ Hospital Rawalakot", phone: "05824-920090" },
    puncture: { name: "Rawalakot bazaar" },
    mechanic: { name: "Rawalakot" },
    rescue: RESCUE,
  },
  leepa: {
    police: { name: "Hattian Bala / Chikar Police", phone: POLICE },
    hospital: { name: "THQ Hospital Hattian Bala (Jhelum Valley)" },
    puncture: { name: "Reshian / Chikar" },
    mechanic: { name: "Muzaffarabad" },
    rescue: RESCUE,
    note: "The Leepa road is steep, seasonal and check-post controlled — minimal services in the valley. " + REMOTE_NOTE,
  },
  nakyal: {
    police: { name: "Nakyal Police (Kotli)", phone: POLICE },
    hospital: { name: "DHQ Hospital Kotli", phone: "058269-20262" },
    puncture: { name: "Nakyal bazaar" },
    mechanic: { name: "Kotli" },
    rescue: RESCUE,
  },

  // ---- Punjab / Sindh ------------------------------------------------------
  murree: {
    police: { name: "Murree Police", phone: POLICE },
    hospital: { name: "THQ Hospital Murree", phone: "051-9269076" }, // verify
    puncture: { name: "Murree (Mall / Kuldana)" },
    mechanic: { name: "Murree" },
    rescue: RESCUE,
  },
  panjpeer: {
    police: { name: "Kahuta / Kallar Syedan Police", phone: POLICE },
    hospital: { name: "THQ Kahuta / Rawalpindi hospitals" },
    puncture: { name: "Kahuta" },
    mechanic: { name: "Rawalpindi" },
    rescue: RESCUE,
  },
  gorakh: {
    police: { name: "Wahi Pandhi / Johi Police (Dadu)", phone: POLICE },
    hospital: { name: "Taluka Hospital Johi / DHQ Dadu", phone: "0254-740212" }, // verify
    puncture: { name: "Wahi Pandhi" },
    mechanic: { name: "Johi / Dadu" },
    rescue: RESCUE,
    note: "Gorakh is ~50km of rough 4x4 track beyond Wahi Pandhi with no services or signal on top; in Sindh, 1122 is the SIEHS ambulance — plan self-evacuation by 4x4 to Johi/Dadu. " + REMOTE_NOTE,
  },
};

export function emergencyFor(id: string): DestinationEmergency {
  return EMERGENCY[id] ?? DEFAULT_EMERGENCY;
}
