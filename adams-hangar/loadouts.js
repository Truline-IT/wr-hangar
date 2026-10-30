/* Data for the wiki's Old robots and 12.5 strategy pages.
   TYPE: weapon families as recorded in Adam's Hangar Codex (claude.ai), so "same type" means same family.
   OLD: robots in Adam's garage that are not on a floor, with the hardpoints recorded in the Codex. */
const TYPE = {
  "Slug shotgun": ["Brisant","Shatter","Unknown Shatter","Splinter","Unknown Splinter"],
  "Blast shotgun": ["Hammer","Freedom Hammer","Mace","Freedom Mace","Cudgel","Freedom Cudgel"],
  "Ball lightning shotgun": ["Kirin","Kirin MK2","Mogwan","Gangil","Gangil MK2"],
  "Top-attack missile": ["Pow","Boom"],
  "Revolver sniper": ["Reaper","Retro Reaper"],
  "Charge laser": ["Prisma","Stellar Prisma"],
  "Laser": ["Hwangje","Yeoje","Ardent Yeoje","Taeja","Ardent Taeja"],
  "Needle gun": ["Machaira","Velos","Basileus"],
  "One-shot": ["Liodari","Kroko","Hippo","Royal Kroko","Royal Hippo"],
  "Grenade launcher": ["Cestus","Labrys","Quicksand Labrys","Ksiphos"],
  "Harmattan shotgun": ["Harmattan-M","Harmattan-L"],
  "Electric cone": ["Leiming","Fengbao","Noir Fengbao","Shifang"],
  "Harpoon": ["Spike","Baihu Stake","Needle","Spear","Ardent Spear"],
  "Energy sniper": ["Shantak","Void Shantak","Urhag","Void Urhag","Voonith"],
  "Homing rockets": ["Talon","Cruel Talon","Jaw","Claw","Cruel Claw"],
  "Freeze rockets": ["Jotunn","Chione","Morana"],
  "Sonic burst": ["Screamer","Growler","Howler","Sport Howler"],
  "Acid launcher": ["Bane","Venom","Toxin","Prototype Toxin"],
  "Energy machine gun": ["Subduer","Trickster","Tamer","Frozen Tamer","Deceiver","Nucleon"],
  "Radiation": ["Decay","Unknown Decay","Hazard","Cryptic Hazard","Blight","Eldritch Blight"],
  "Acid shotgun": ["Elox","Blaze Elox","Murix"],
  "Homing missiles": ["Smite","Smite MK2","Discipline","Discipline MK2","Dune"],
  "Flamethrower": ["Kelvin","Blaze Kelvin","Fahrenheit","Blaze Fahrenheit","Celsius"],
  "Magnetic repair gun": ["Athos","Porthos","Aramis"],
  "Two-mode rifle": ["Leinani","Nanea"],
  "Sonic shotgun": ["Havoc","Fatal Havoc","Scatter"],
  "Mine launcher": ["Hedjet","Steel Hedjet","Steel Deshret","Pshent","Steel Pshent"],
  "Homing beam": ["Lumen-H","Lumen-M","Lumen-L","Omen Lumen-L","Omen Lumen-M"],
  "Autocannon": ["Pilum","Gladius"],
  "Homing machine gun": ["Razdor","Spirit Razdor","Smuta","Spirit Smuta","Kramola"],
  "Long machine gun": ["Regulator"],
  "Missile": ["Hurricane"],
  "Rockets": ["Steel Piercer","Orkan","ULTIMATE Orkan"],
  "Artillery": ["Noricum"]
};
const TYPE_OF = {};
Object.keys(TYPE).forEach(t => TYPE[t].forEach(n => { TYPE_OF[n.toLowerCase()] = t; }));
const OLD = [
  { name: "Natasha", tier: "Blue", level: 8, slots: "LL", ability: "No ability" },
  { name: "Raven", tier: "Purple", level: 4, slots: "MMLL", ability: "Double Jump: 2 charges, +20% damage for 8 s" },
  { name: "Inquisitor", tier: "Purple", level: 4, slots: "MMH", ability: "Descend: 5 s stealth" },
  { name: "Ao Jun", tier: "Purple", level: 3, slots: "HH", ability: "Dragon Breath: flight with a 350 m flamethrower" },
  { name: "Blitz", tier: "Purple", level: 1, slots: "LLLL", ability: "Break-in: enemies deal 75% less damage" },
  { name: "Kumiho", tier: "Blue", level: 2, slots: "MM", ability: "Dash: 2 charges" },
  { name: "Gareth", tier: "Grey", level: 6, slots: "LM", ability: "Phalanx: frontal shield" }
];
