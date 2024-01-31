import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

const PromotionCard = ({ title, imageURL }: { title: string, imageURL: string }) => {
    return (
        <>
            <figure>
                <img alt="preview" src={imageURL} className="object-cover w-full h-60" />
            </figure>
            <div className="p-4 space-y-4 bg-grey-25">
                <h5>{title}</h5>
                <div className="grid grid-cols-1 gap-2 mxs:grid-cols-2">
                    <Dialog>
                        <DialogTrigger
                            asChild
                        >
                            <Button type="button" variant="primary">
                                View
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className="max-w-[1280px] p-0 border-0 gap-y-0 promotion-view w-auto"
                        >
                            <div className="px-5 py-3">
                                <h5>SWITCH TO BLUEJET COMPETITION </h5>
                            </div>
                            <img alt="preview" src={imageURL} className="h-auto max-h-[calc(100vh_-_100px)]" />
                        </DialogContent>
                    </Dialog>
                    <Button type="button" variant="ghost">
                        Customise
                    </Button>
                </div>
            </div>
        </>
    );
}

export default PromotionCard;