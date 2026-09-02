import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalProps {
  children: ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
}

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export interface TableProps
  extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export interface StatusFilterProps<TValue extends string> {
  label?: string;
  options: TValue[];
  value: TValue;
  onChange: (value: TValue) => void;
}
