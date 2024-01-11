import { useIsSubmitting } from "remix-validated-form";

export default function SubmitButton() {
    const isSubmitting = useIsSubmitting();
    return (
        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
    );
};