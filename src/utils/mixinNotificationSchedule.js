export default {
  data() {
    return {
      notificationInterval: null,
    };
  },
  computed: {
    windowHasFocus() {
      return this.$store.getters['Window/hasFocus'];
    },
    windowTimestampOfBlur() {
      return this.$store.getters['Window/timestampOfBlur'];
    },
    nextSchedule() {
      return this.$store.getters['Notifications/nextSchedule'];
    },
    notificationsAfterWindowBlur() {
      return this.$store.getters['Notifications/listAfterTimestamp'](this.windowTimestampOfBlur);
    },
    notificationsPreventOnBlur() {
      return this.$store.getters['Notifications/preventOnBlur'];
    },
    notificationsScheduleActive() {
      return this.$store.getters['Notifications/scheduleActive'];
    },
  },
  watch: {
    windowHasFocus(isFocused) {
      if (isFocused) {
        return clearInterval(this.notificationInterval);
      }

      if (!this.notificationsPreventOnBlur || !this.notificationsScheduleActive) {
        return false;
      }

      this.notificationInterval = setInterval(() => {
        const notificationTitle = 'Pigment: Scheduled Notification';

        if (this.nextSchedule > Date.now()) return;

        const newNotifications = this.notificationsAfterWindowBlur;

        if (newNotifications.length === 1) {
          const notificationOptions = { ...newNotifications[0].notification.options };
          notificationOptions.body = `${newNotifications[0].notification.title}: ${notificationOptions.body}`;

          new Notification( // eslint-disable-line no-new
            notificationTitle,
            notificationOptions,
          );
        } else if (newNotifications.length) {
          const notificationOptions = {
            body: `[${newNotifications.length}] New Notifications`,
          };

          new Notification( // eslint-disable-line no-new
            notificationTitle,
            notificationOptions,
          );
        }

        this.$store.dispatch('Notifications/calcNextSchedule');
      }, 2000);

      return true;
    },
  },
  beforeDestroy() {
    clearInterval(this.notificationInterval);
  },
};