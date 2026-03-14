const { log, LogLevel } = require("@peacockproject/core/loggingInterop")
const { PEACOCKVER, PEACOCKVERSTRING, compare } = require("@peacockproject/core/utils")
const { existsSync, readFileSync } = require("fs")

module.exports = function FreelancerVariations(controller) {
	if (Math.abs(PEACOCKVER) < 6000 || compare(PEACOCKVERSTRING, "8.0.0") < 0) {
		log(
			LogLevel.ERROR,
			`[Freelancer Variations] This plugin requires Peacock version v8.0.0 or above! You're on v${PEACOCKVERSTRING}!`
		)
		return
	}

	if (!controller.smf.modIsInstalled("KevinRudd.FreelancerVariations")) {
		log(LogLevel.ERROR, "[Freelancer Variations] Mod currently not deployed, please deploy it in SMF.")
		return
	}

	const configPath = existsSync(`./FreelancerVariations.json`)
		? "./FreelancerVariations.json"
		: existsSync(`./plugins/FreelancerVariations.json`)
		? "./plugins/FreelancerVariations.json"
		: null

	if (!configPath) {
		log(
			LogLevel.ERROR,
			'[Freelancer Variations] Could not find "FreelancerVariations.json", grab from Nexus SDK download or Variant Picker website and put in your Peacock plugins folder.'
		)
		return
	}

	const config = JSON.parse(readFileSync(configPath, "utf-8"))

	for (const patch of config["patches"]) {
		const contract = controller.resolveContract(patch["id"], "h3")

		if (!contract) {
			log(
				LogLevel.WARN,
				`[Freelancer Variations] Could not resolve contract id ${patch["id"]}, report this to the mod author!`
			)
			continue
		}

		if (patch["clearDefaultBricks"]) contract["Data"]["Bricks"] = []

		if (patch["resetVRBricks"])
			contract["Data"]["VR"] = [
				{
					Quality: "base",
					Bricks: [
						"assembly:/_pro/Scenes/Bricks/vr_setup.brick",
						"assembly:/_pro/Scenes/Bricks/evergreen_vr_setup.brick",
						"assembly:/_pro/scenes/missions/coastaltown/vr_overrides_low_performance.brick"
					]
				},
				{
					Quality: "better",
					Bricks: [
						"assembly:/_pro/Scenes/Bricks/vr_setup.brick",
						"assembly:/_pro/Scenes/Bricks/evergreen_vr_setup.brick"
					]
				}
			]

		if ("RandomBricks" in contract["Data"]) {
			if ("TimeOfDay" in contract["Data"]["RandomBricks"]) {
				contract["Data"]["RandomBricks"]["TimeOfDay"].concat(patch["bricks"])
			} else {
				contract["Data"]["RandomBricks"]["TimeOfDay"] = patch["bricks"]
			}
		} else {
			contract["Data"]["RandomBricks"] = {
				TimeOfDay: patch["bricks"]
			}
		}

		for (const i in contract["Data"]["GameDifficulties"]) {
			if (contract["Data"]["GameDifficulties"][i]["Difficulty"] == "hard") {
				contract["Data"]["GameDifficulties"][i]["Bricks"] = patch["hardbricks"]
			}
		}

		controller.addMission(contract)
	}

	log(LogLevel.INFO, "[Freelancer Variations] Plugin successfully loaded.")
}
