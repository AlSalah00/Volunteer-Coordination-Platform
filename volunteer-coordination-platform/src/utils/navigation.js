export function getDashboardRoute(role) {
  switch (role) {
    case "organizer":
      return "/organizer/dashboard";

    case "volunteer":
      return "/volunteer/dashboard";

    default:
      return "/";
  }
}