/* The written playbook for the newest update, shown at the top of the wiki's strategy page.
   Every number comes from the official update notes (news/patch-notes.json) and the hangar data
   recorded on 12 October (data.js). Spare weapons are allocated once across the whole plan, so no
   weapon is used twice. Replace this object when the next update lands. */
const PLAYBOOK = {
  ver: "12.5",
  summary: [
    ["buff", "Slug shotguns are the big winners", "Brisant, Shatter and Splinter reload in 4 s instead of 5 and hit harder (Shatter 615 → 725 per pellet). Adam owns spares of all three, so the plan below moves them onto robots that lost their guns' power."],
    ["buff", "Homing rockets and lasers got faster or stronger", "Talon, Jaw and Claw reload in 4 s instead of 5. Hwangje went from 1594 to 2010 damage per particle and Yeoje from 1317 to 1507, so Floor 1's laser robots got better without any change."],
    ["nerf", "Flamethrowers fire at half speed", "Celsius, Fahrenheit and Kelvin went from a shot every 0.07 s to every 0.15 s and overheat at 10 s instead of 13, for only about 12% more damage per shot. Crisis and Vector lose most of their output."],
    ["nerf", "Energy snipers became slow single shots", "Shantak, Urhag and Voonith now fire every 2.2 s instead of 0.8 s, reload 1 round at a time instead of 3, and carry 10 rounds instead of 13. Void Shoggoth's long-range floor-5 role suffers most."],
    ["nerf", "Anaksor, Ammit and Atlas lost their edge", "Anaksor drops from 330,000 to 260,000 durability and loses an invisibility charge; its needle guns reload in 7 s instead of 5. Ammit keeps more durability but walks at 35 km/h instead of 52 with a 6 s ability. Atlas's Ascension absorber lasts 5 s instead of 7."]
  ],
  floors: [
    { n: 5, title: "Lead Floor", moves: [
      ["keep", "Samjok MK2 still leads", "Nothing on Samjok, Kirin MK2 or Gangil MK2 changed in 12.5. It is now the safest opener in the hangar."],
      ["swap", "Void Shoggoth MK2: snipers out, slugs and radiation in", "Swap Void Shantak and Shantak for 2 Brisant (heavy, 600 m, 4 s reload, 966 per pellet), and Void Urhag and Urhag for 2 Cryptic Hazard (medium, 600 m, 4956 per particle). The snipers lost two thirds of their rate of fire, and Shoggoth lost 38% of its Aegis, so it can no longer sit back and trade shots. This is close to the Brisant and Shatter build in the Hangar Codex."],
      ["note", "Atlas is weaker, hold it longer", "Void and Chasm lost about 12% damage per second (995 per particle every 0.7 s instead of 1300 every 0.8 s) and the frontal absorber is shorter. Drop Atlas into a fight you are already winning, not to save one."]
    ]},
    { n: 4, title: "Heavy Hitters", moves: [
      ["swap", "Anaksor MK2: needle guns out, slug shotguns in", "Swap the two Machaira for 2 Shatter (medium, 600 m) and Basileus for Brisant (heavy, 600 m). All three reload in 4 s now, against 7 s for the needles, and every gun on Anaksor reaches 600 m. Anaksor itself is fragile now, so send it second, behind Teth."],
      ["swap", "Vector: flames out, slugs in", "Swap the two Celsius for 2 Unknown Splinter (light, 600 m) and Blaze Fahrenheit for Unknown Shatter (medium, 600 m). Skadi already reaches 600 m, so the whole robot fires at one range. Event Horizon now slows Vector by 50% while it runs, so use it on the spot, not to travel."],
      ["keep", "Teth leads unchanged", "Teth and its Steel mine launchers were not touched, and it is the toughest robot on this floor at 257,400."],
      ["keep", "Hastatus keeps Lumen-H", "Lumen-H went from 1300 to 2000 per particle. Its Thermal Breach stacking fell from 1.15 to 0.15 per stack, so it no longer ramps up. Fire in short bursts at different targets instead of holding on one."]
    ]},
    { n: 3, title: "Close It", moves: [
      ["keep", "Typhon gets better for free", "Its 4 Unknown Shatter reload in 4 s now and its Aegis rose from 60,000 to 75,000. The Blackout then shotgun combo is stronger than before."],
      ["keep", "Retro Revenant gets better for free", "Talon and Cruel Claw reload in 4 s instead of 5 with more damage."],
      ["note", "Kaji: one big volley, then leave", "Boom and Pow hit about 5% harder but reload in 10 s instead of 7. Mines first, one volley on the Deathmarked target, then fall back while they reload."],
      ["note", "Newton lost damage", "Furnace dropped from 1925 to 1310 and Torch from 1540 to 870, with reload 9 → 8 s. Newton is a support titan now, not a finisher."]
    ]},
    { n: 2, title: "Shield Break", moves: [
      ["note", "Ammit is an anchor now, not a lead", "Ammit gained durability (495,000 → 550,000 at max) but moves at 35 km/h, and its ability lasts 6 s with a 13 s cooldown. Deploy it on the nearest beacon and hold there; it can no longer chase. Its Hippo and Kroko guns reload in 6 s instead of 5."],
      ["keep", "Noir Shenlou is the new lead", "Each blink now gives 50,000 Aegis instead of 40,000, and Baihu Stake went from 19,600 to 23,800. Shenlou is the strongest robot on this floor after 12.5."],
      ["swap", "Fill Mars: 3 Labrys", "Mars still has three empty medium hardpoints. Fit 3 Labrys (500 m grenades, 2346 → 2933 per particle in 12.5); Adam has 4 spare. Fill Nodens's weapons too before this floor goes out."]
    ]},
    { n: 1, title: "The Grind", moves: [
      ["swap", "Crisis: flames out, 4 Hwangje in", "Swap all four Kelvins for 4 Hwangje (heavy, 800 m, no reload, 1594 → 2010 per particle). The floor's idea, nothing reloads, stays the same, but the flamethrowers lost about half their output and Hwangje gained 26%."],
      ["keep", "Vulcan, Demeter and Ardent Imugi got better for free", "Yeoje and Ardent Yeoje gained 14%, Hazard and Spirit Razdor were buffed, and Ardent Imugi's damage bonus doubled from 5% to 10%."],
      ["keep", "Blaze Rex gets better for free", "Its two Shatter reload in 4 s instead of 5 and hit harder."]
    ]}
  ],
  ledger: "Spare weapons used: Brisant 3 of 3, Shatter 2 of 2, Unknown Shatter 1 of 1, Unknown Splinter 2 of 3, Cryptic Hazard 2 of 3, Labrys 3 of 4, Hwangje 4 of 4. The guns taken off (Shantak, Void Shantak, Urhag, Void Urhag, Machaira, Basileus, Celsius, Blaze Fahrenheit, Kelvin, Blaze Kelvin) go back to the garage."
};
