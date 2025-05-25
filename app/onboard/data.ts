import { OnboardingItem } from "@/types/onboard";

const ONBOARDING_DATA: OnboardingItem[] = [
    {
        id: 1,
        heading: "Split bills with Ease",
        description:
            "Simple way to manage shared expenses with friends. Start explore now!",
        image: require("@/assets/images/onboard-1.png"),
    },
    {
        id: 2,
        heading: "Flexible ways to share expenses",
        description:
            "Evenly or by percentage — flexible for every group and situation",
        image: require("@/assets/images/onboard-2.png"),
    },
    {
        id: 3,
        heading: "Snap and track receipts easily",
        description: "Upload photos of bills and keep your spending organized",
        image: require("@/assets/images/onboard-3.png"),
    },
];

export default ONBOARDING_DATA;
