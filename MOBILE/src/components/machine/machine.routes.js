export const machineRoutes = [
    {
        path: "/quantity-report",
        component: () =>
            import("pages/machine/KhaiBaoSanLuongMay.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-a-machine-problem",
        component: () =>
            import("pages/machine/KhaiBaoSuCoMay.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/check-machine-day",
        component: () =>
            import("pages/machine/Kiemtramaytheongay.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/check-machine-error",
        component: () =>
            import("pages/machine/CheckMachineError.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/approved-complete-repair",
        component: () =>
            import("pages/machine/ApprovedCompleteRepair.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/machine-maintenance",
        component: () =>
            import("pages/machine/MachineMaintenance.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
      path: "/calendar-machine-maintenance",
      component: () =>
          import("pages/machine/CalendarMachineMaintenance.vue"),
      meta: {
          requiresAuth: true
      }
    },
    {
        path: "/send-message",
        component: () =>
            import("pages/machine/SendMessage.vue"),
        meta: {
            requiresAuth: true
        }
    },

];