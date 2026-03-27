import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";

// ── Table data ────────────────────────────────────────────────────────────────
const MAGIC_TABLE = {
  "Physical Effects": [
    "Animating", "Attracting", "Binding", "Blossoming", "Consuming", "Creeping",
    "Levitating", "Opening", "Petrifying", "Phasing", "Piercing", "Pursuing",
    "Crushing", "Diminishing", "Dividing", "Duplicating", "Enveloping", "Expanding",
    "Reflecting", "Regenerating", "Rending", "Repelling", "Resurrecting", "Screaming",
    "Fusing", "Grasping", "Hastening", "Hindering", "Illuminating", "Imprisoning",
    "Sealing", "Shapeshifting", "Shielding", "Spawning", "Transmuting", "Transporting",
  ],
  "Physical Forms": [
    "Altar", "Armor", "Arrow", "Beast", "Blade", "Cauldron",
    "Chain", "Chariot", "Claw", "Cloak", "Colossus", "Crown",
    "Sentinel", "Servant", "Shield", "Spear", "Steed", "Swarm",
    "Horn", "Key", "Mask", "Monolith", "Pit", "Prison",
    "Elemental", "Eye", "Fountain", "Gate", "Golem", "Hammer",
    "Tentacle", "Throne", "Trap", "Wall", "Torch", "Web",
  ],
  "Physical Elements": [
    "Acid", "Amber", "Bark", "Blood", "Bone", "Brine",
    "Clay", "Crow", "Crystal", "Ember", "Flesh", "Fungus",
    "Sand", "Sap", "Serpent", "Slime", "Stone", "Tar",
    "Moss", "Obsidian", "Oil", "Poison", "Rat", "Salt",
    "Glass", "Honey", "Ice", "Insect", "Wood", "Lava",
    "Thorn", "Vine", "Water", "Wine", "Worm", "Ash",
  ],
  "Ethereal Effects": [
    "Avenging", "Banishing", "Blinding", "Charming", "Communicating", "Compelling",
    "Concealing", "Deafening", "Deceiving", "Deciphering", "Disguising", "Bewildering",
    "Dispelling", "Emboldening", "Encoding", "Energizing", "Enlightening", "Enraging",
    "Excruciating", "Foreseeing", "Intoxicating", "Maddening", "Mesmerizing", "Mindreading",
    "Nullifying", "Paralyzing", "Revealing", "Revolting", "Scrying", "Silencing",
    "Soothing", "Summoning", "Terrifying", "Warding", "Wearying", "Withering",
  ],
  "Ethereal Elements": [
    "Ash", "Chaos", "Distortion", "Dream", "Dust", "Echo",
    "Ectoplasm", "Fire", "Fog", "Ghost", "Harmony", "Heat",
    "Smoke", "Snow", "Soul", "Star", "Stasis", "Steam",
    "Plague", "Plasma", "Probability", "Rain", "Rot", "Shadow",
    "Light", "Lightning", "Memory", "Mind", "Mutation", "Negation",
    "Thunder", "Time", "Void", "Warp", "Whisper", "Wind",
  ],
  "Ethereal Forms": [
    "Aura", "Beacon", "Beam", "Blast", "Blob", "Bolt",
    "Bubble", "Call", "Cascade", "Circle", "Cloud", "Coil",
    "Cone", "Cube", "Dance", "Disk", "Field", "Form",
    "Gaze", "Loop", "Moment", "Nexus", "Portal", "Pulse",
    "Pyramid", "Ray", "Shard", "Sphere", "Spray", "Storm",
    "Swarm", "Torrent", "Touch", "Vortex", "Wave", "Word",
  ],
};

const CATEGORIES = Object.keys(MAGIC_TABLE);

// ── Helpers ───────────────────────────────────────────────────────────────────
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollEntries(n) {
  const results = [];
  for (let i = 0; i < n; i++) {
    const category = randomItem(CATEGORIES);
    const word = randomItem(MAGIC_TABLE[category]);
    results.push({ category, word });
  }
  return results;
}

// ── Bot setup ─────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const command = new SlashCommandBuilder()
  .setName("magic")
  .setDescription("Roll random entries from the Maze Rats magic tables")
  .addIntegerOption((opt) =>
    opt
      .setName("count")
      .setDescription("How many entries to roll (1–10, default 1)")
      .setMinValue(1)
      .setMaxValue(10)
      .setRequired(false)
  );

// Register slash command on startup
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: [command.toJSON()],
    });
    console.log("Slash commands registered.");
  } catch (err) {
    console.error("Failed to register commands:", err);
  }
});

// Handle /magic
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "magic") return;

  const count = interaction.options.getInteger("count") ?? 1;
  const entries = rollEntries(count);

  const lines = entries.map(
    ({ category, word }) => `• **${word}** — *${category}*`
  );

  const header = count === 1 ? "🎲 Magic Roll" : `🎲 Magic Roll ×${count}`;
  await interaction.reply(`**${header}**\n${lines.join("\n")}`);
});

client.login(process.env.DISCORD_TOKEN);
