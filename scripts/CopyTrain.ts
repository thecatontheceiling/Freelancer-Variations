// Piepieonline's Hantu Freelancer deployment script v1

import fs from "fs"
import path from "path"

export const analysis = (context, api) => Promise.resolve()
export const beforeDeploy = (context, api) => Promise.resolve()

export const afterDeploy: ModScript["afterDeploy"] = async function (context, api) {
	const modID = context.deployInstruction.id

	api.logger.info("Copying Romania files to shared chunk for Freelancer access")

	fs.copyFileSync(context.config.runtimePath + "/chunk7.rpkg", context.config.runtimePath + "/chunk8patch200.rpkg")
	fs.copyFileSync(context.config.runtimePath + "/chunk7patch1.rpkg", context.config.runtimePath + "/chunk8patch201.rpkg")
	fs.copyFileSync(context.config.runtimePath + "/chunk7patch2.rpkg", context.config.runtimePath + "/chunk8patch202.rpkg")
	fs.copyFileSync(context.config.runtimePath + "/chunk7patch3.rpkg", context.config.runtimePath + "/chunk8patch203.rpkg")
	if (fs.existsSync(`${context.config.runtimePath}/chunk7patch4.rpkg`))
		fs.copyFileSync(
			context.config.runtimePath + "/chunk7patch4.rpkg",
			context.config.runtimePath + "/chunk8patch204.rpkg"
		)
	fs.copyFileSync(context.config.runtimePath + "/chunk2.rpkg", context.config.runtimePath + "/chunk8patch205.rpkg")
	fs.copyFileSync(context.config.runtimePath + "/chunk2patch1.rpkg", context.config.runtimePath + "/chunk8patch206.rpkg")
	fs.copyFileSync(context.config.runtimePath + "/chunk2patch2.rpkg", context.config.runtimePath + "/chunk8patch207.rpkg")
	fs.copyFileSync(context.config.runtimePath + "/chunk2patch3.rpkg", context.config.runtimePath + "/chunk8patch208.rpkg")
	if (fs.existsSync(`${context.config.runtimePath}/chunk2patch4.rpkg`))
		fs.copyFileSync(
			context.config.runtimePath + "/chunk2patch4.rpkg",
			context.config.runtimePath + "/chunk8patch209.rpkg"
		)

	return Promise.resolve()
}

export const cachingPolicy: ModScript["cachingPolicy"] = {
	affected: []
}
