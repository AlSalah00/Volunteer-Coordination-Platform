/**
 * Derives the drawer's content from application status + activity status
 * combined. Not application status alone, since for example, an approved
 * application means something different if the activity later gets
 * cancelled versus if it's still upcoming.
 */
export function getApplicationState({ applicationStatus, activityStatus, checkInStatus, reviewStatus }) {
  if (applicationStatus === "rejected" || applicationStatus == "submitted" && activityStatus == "active" || applicationStatus == "submitted" && activityStatus == "completed") {
    return {
      label: "Not this time  :(",
      state: "The host went with other volunteers for this one.",
      whatsNext: "Don't be discouraged. There are plenty of other activities to explore.",
      showAiFeedback: false,
      showCompletion: false,
      action: {
        label: "Explore other activities",
        type: "NAVIGATE_EXPLORE",
        variant: "primary",
      }
    };
  }

  if (activityStatus === "cancelled") {
    return {
      label: "Activity Cancelled",
      state: "Unfortunately, this activity was cancelled by the host.",
      whatsNext: "No action needed on your part. Feel free to explore other activities.",
      showAiFeedback: false,
      showCompletion: false,
      action: {
        label: "Explore other activities",
        type: "NAVIGATE_EXPLORE",
        variant: "primary",
      }
    };
  }

  if (applicationStatus === "submitted") {
    return {
      label: "Awaiting Host",
      state: "You've raised your hand for this!",
      whatsNext: "Sit tight, the host is finalizing the team and will update you soon.",
      showAiFeedback: true,
      showCompletion: false,
      action: {
        label: "Withdraw Application",
        type: "WITHDRAW_APPLICATION",
        variant: "danger",
      }
    };
  }

  // From here on, applicationStatus is "approved".
  if (activityStatus === "active") {
    return {
      label: "Happening Now",
      state: "This activity is happening right now!",
      whatsNext: "Head to your assigned task and give it your best. And don't forget to check in!",
      showAiFeedback: false,
      showCompletion: true,
      action: {
        label: checkInStatus ? "You're Checked-In" : "Check-In!",
        type: "CHECK_IN",
        disabled: checkInStatus ? true : false,
        variant: "primary",
      }
    };
  }

  if (activityStatus === "completed") {
    return {
      label: "Completed",
      state: "You completed this activity. Nice work!",
      whatsNext: "Optionally, you can now send a review of this activity to the host.",
      showAiFeedback: false,
      showCompletion: true,
      action: {
        label: reviewStatus ? "View Your Review" : "Review",
        type: "REVIEW",
        variant: "primary",
      }
    };
  }

  // activityStatus === "upcoming"
  return {
    label: "You're In!",
    state: "Spot confirmed! You're officially part of the team.",
    whatsNext: "Mark your calendar, we can't wait to see you there.",
    showAiFeedback: false,
    showCompletion: false,
    action: {
      label: "Back",
      type: "NAVIGATE_BACK",
      variant: "secondary",
    }
  };
}
