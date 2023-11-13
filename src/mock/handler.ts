import { oAuth } from "./api/oAuth";
import { getAreas } from "./api/areas";
import { getScenarios, updateScenario } from "./api/scenarios";
import { getProjects } from "./api/projects";
import { createUser, deleteUser, getUsers, updateUser, userSignUp } from "./api/user";

export const handlers = [
  oAuth(),
  userSignUp(),
  updateUser(),
  deleteUser(),
  createUser(),
  getUsers(),
  getAreas(),
  getScenarios(),
  updateScenario(),
  getProjects()
]