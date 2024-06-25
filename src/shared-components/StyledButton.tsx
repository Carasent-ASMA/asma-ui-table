import { Button, type ButtonProps } from '@mui/material'
export const StyledButton = (props: ButtonProps) => (
    <Button
        {...props}
        sx={{
            ...props.sx,
            color: 'var(--colors-gama-500)',
            borderColor: 'var(--colors-gama-500)',
            '&:hover': {
                borderColor: 'var(--colors-gama-500)',
            },
        }}
    />
)
