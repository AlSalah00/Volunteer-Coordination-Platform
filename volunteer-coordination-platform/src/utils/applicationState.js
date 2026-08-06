/**
 * Derives the drawer's content from application status + activity status
 * combined. Not application status alone, since for example, an approved
 * application means something different if the activity later gets
 * cancelled versus if it's still upcoming.
 */
export function getApplicationState({ applicationStatus, activityStatus }) {
  if (applicationStatus === "rejected") {
    return {
      label: "Not Selected",
      state: "The organizer went with other volunteers for this one.",
      whatsNext: "No action needed, there are plenty of other activities to explore.",
      showAiFeedback: false,
      showWithdrawButton: false,
    };
  }

  if (activityStatus === "cancelled") {
    return {
      label: "Activity Cancelled",
      state:
        applicationStatus === "approved"
          ? "This activity was cancelled after you were approved."
          : "This activity was cancelled before your application could be reviewed.",
      whatsNext: "No action needed on your part.",
      showAiFeedback: false,
      showWithdrawButton: false,
    };
  }

  if (applicationStatus === "submitted") {
    return {
      label: "Pending",
      state: "You've submitted your application.",
      whatsNext: "Sit tight, the organizer will review it soon.",
      showAiFeedback: true,
      showWithdrawButton: true,
    };
  }

  // From here on, applicationStatus is "approved".
  if (activityStatus === "active") {
    return {
      label: "Happening Now",
      state: "This activity is happening right now!",
      whatsNext: "Head to your assigned task and give it your best.",
      showAiFeedback: false,
      showWithdrawButton: false,
    };
  }

  if (activityStatus === "completed") {
    return {
      label: "Completed",
      state: "You completed this activity. Nice work!",
      whatsNext: "Check back for new activities to join.",
      showAiFeedback: false,
      showWithdrawButton: false,
    };
  }

  // activityStatus === "upcoming"
  return {
    label: "Approved",
    state: "Congratulations! You've been approved to participate.",
    whatsNext: "Mark your calendar, the activity hasn't started yet.",
    showAiFeedback: false,
    showWithdrawButton: false,
  };
}
