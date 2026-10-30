/* The written playbook for the newest update, shown at the top of the wiki's strategy page.
   Every number comes from the official update notes (news/patch-notes.json) and the hangar data
   read on 19 October (data.js, synced from the hangar page). It goes robot by robot, not floor by
   floor, because the floors change all the time. Spare weapons are allocated once across the whole
   plan, so no weapon is used twice. Replace this object when the next update lands. */
const PLAYBOOK = {
  ver: "12.5",
  summary: [
    ["buff", "Slug shotguns are the big winners", "Brisant, Shatter and Splinter reload in 4 s instead of 5 and hit harder (Shatter 615 → 725 per pellet, Brisant 920 → 966). Adam owns spares of all three, so the plan below moves them onto the robots whose guns were nerfed."],
    ["buff", "Labrys, Hwangje, Shenlou and Rook got stronger", "Labrys went from 2346 to 2933 per particle and Hwangje from 1594 to 2010. Noir Shenlou gets 50,000 Aegis per blink instead of 40,000. Rook rose to 800,000 durability with a 13 s Castling cooldown."],
    ["nerf", "Energy snipers became slow single shots", "Shantak and Urhag now fire every 2.2 s instead of 0.8 s, reload 1 round at a time instead of 3 and carry 10 rounds instead of 13. Void Shoggoth carries four of them and lost 50,000 durability."],
    ["nerf", "Needle guns and flamethrowers slowed down", "Machaira, Basileus and Velos reload in 7 s instead of 5 and lost 10% damage. Celsius, Fahrenheit and Kelvin fire every 0.15 s instead of 0.07 s. That hits Anaksor, Scorpion and Vector."],
    ["nerf", "Anaksor, Ammit and Atlas lost their edge", "Anaksor drops from 330,000 to 260,000 durability. Ammit gains durability but moves at 35 km/h instead of 52 and its ability runs 6 s on a 13 s cooldown. Atlas's frontal Absorber lasts 5 s instead of 7."]
  ],
  robots: [
    ["swap", "Void Shoggoth MK2", "Snipers out, slugs in", "Swap Shantak and Void Shantak for 2 Brisant (heavy, 600 m, 4 s reload), and Urhag and Void Urhag for 2 Unknown Shatter (medium, 600 m, 4 s reload). All four fire together at one range instead of one slow shot every 2.2 s."],
    ["swap", "Anaksor MK2", "Needle guns out, slugs in", "Swap the two Machaira for 2 Unknown Shatter and Basileus for the last Brisant. All three reload in 4 s against 7 s for the needles. Anaksor has 260,000 durability now, so let a tank open first."],
    ["swap", "Scorpion MK2", "Needle guns out, slugs in", "Swap the two Machaira for 2 Shatter (medium, 600 m) and Velos for Splinter (light, 600 m). Scorpion itself was buffed (201,000 → 220,000 durability at max level), so it can stay in the fight after a Backstab."],
    ["swap", "Vector MK2", "Flames out, slugs in", "Swap the two Celsius for 2 Unknown Splinter and Blaze Fahrenheit and Fahrenheit for the last 2 Shatter. Event Horizon now slows Vector by 50% while it runs, so fight from 600 m instead of diving in."],
    ["swap", "Crisis", "Fill it: 4 Hwangje", "Crisis is on the bench with four empty heavy hardpoints. Fit the 4 spare Hwangje (800 m, no reload, 1594 → 2010 per particle in 12.5)."],
    ["swap", "Mars", "Fill it: 3 Labrys", "Mars is on the bench with three empty medium hardpoints. Fit the 3 spare Labrys (500 m grenades, 2346 → 2933 per particle in 12.5)."],
    ["keep", "Noir Shenlou MK2", "The best lead after 12.5", "Each blink now gives 50,000 Aegis instead of 40,000. Blink onto whoever turns to shoot your tank."],
    ["keep", "Ophion", "Better for free", "Its three Labrys hit 25% harder. Nothing else on Ophion changed."],
    ["keep", "Fenrir MK2", "Better for free", "Calamity MK2 went from 1043 to 1134 per particle. Skadi and Ballista were not touched."],
    ["keep", "Frozen Dagon MK2", "Better for free", "Aegis went from 90,000 to 100,000 and regenerates 11,000 instead of 10,000. Its six light hardpoints were not read on 19 October, so check them in the game."],
    ["keep", "Samjok, Dux, Teth, Hastatus, Spectre, Fang and Nuo", "Untouched", "Nothing on these robots or their weapons changed in 12.5. They are now the safest picks in the hangar."],
    ["note", "Ammit", "An anchor now, not a lead", "550,000 durability at max but 35 km/h, and the ability lasts 6 s with a 13 s cooldown. Deploy it on the nearest beacon and hold there instead of chasing."],
    ["note", "Shell", "One big volley, then cover", "Boom and Pow hit about 5% harder but reload in 10 s instead of 7. Fire everything at one target, then break line of sight while they reload."],
    ["note", "Baihu Lynx MK2 and Vulcan MK2", "Lumen: burst, don't hold", "Lumen damage went up (Lumen-H 1300 → 2000, Lumen-M 975 → 1500) but Thermal Breach stacking fell from 1.15 to 0.15 per stack, so it no longer ramps up. Fire in short bursts and switch targets freely."],
    ["note", "Atlas, Newton, Rook and Devourer", "Titans", "Atlas is weaker (Absorber 5 s, Chasm and Void about 12% less damage per second), so drop it into a fight you are already winning. Rook is stronger at 800,000. Newton's Torch fell from 1540 to 870 while Tonans rose from 3270 to 3967. Devourer's Arbiter went from 2800 to 3150."]
  ],
  ledger: "Spare weapons used: Brisant 3 of 3, Unknown Shatter 4 of 5, Shatter 4 of 4, Unknown Splinter 2 of 3, Splinter 1 of 2, Hwangje 4 of 4, Labrys 3 of 3. The guns taken off (Shantak, Void Shantak, Urhag, Void Urhag, Machaira, Basileus, Velos, Celsius, Fahrenheit, Blaze Fahrenheit) go back to the spare pile."
};
