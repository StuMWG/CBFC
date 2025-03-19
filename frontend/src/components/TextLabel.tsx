import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    color?: "primary" | "secondary" | "danger";
}