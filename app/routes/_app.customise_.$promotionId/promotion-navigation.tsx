import html2canvas from "html2canvas";
import { useState } from "react";
import { ExportUp } from "~/components/icons/export";
import { BackButton } from "~/components/ui/back-button";
import { Button } from "~/components/ui/button";
import Loader from "~/components/ui/loader";

const PromotionNavigation = (canvasRef: any) => {
    const [loading, setLoading] = useState(false);

    const printDocument = (canvasRef: HTMLElement) => {
        setLoading(true);
        if (canvasRef) {
            html2canvas(canvasRef, {
                allowTaint: true,
                useCORS: true,
                scale: 2,
            }).then((canvas) => {
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.download = 'preview.png';
                link.href = canvas.toDataURL();
                link.target = '_blank';
                link.click();
                setLoading(false);
            });
        } else {
            alert('Error occured while exporting the image. Please try again.');
            setLoading(false);
        }
    };
    return (
        <section className="container pt-8 pb-1">
            <div className="flex flex-wrap justify-between gap-4">
                <BackButton title="Customize Promotion" />
                <Button
                    type="button"
                    size="small"
                    variant="ghost"
                    className={`border-primary-500 hover:bg-inherit ${loading && 'pointer-events-none'
                        }`}
                    onClick={() => printDocument(canvasRef.canvasRef.current)}
                >
                    {loading ? <Loader /> : <ExportUp />}Export
                </Button>
            </div>
        </section>
    );
}

export default PromotionNavigation;