import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

const PromotionList = () => {
    return (
        <section className="container">
            <div className="p-6 bg-white">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <figure>
                            <img alt="preview" src="/images/imageEditorLarge.jpg" className="object-cover w-full h-60" />
                        </figure>
                        <div className="p-4 space-y-4 bg-grey-25">
                            <h5><Link to="/">SWITCH TO BLUEJET COMPETITION TERMS AND CONDITIONS</Link></h5>
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
                                        className="max-w-xl p-0 border-0 gap-y-0 promotion-view"
                                    >
                                        <div className="px-5 py-3">
                                            <h5>SWITCH TO BLUEJET COMPETITION </h5>
                                        </div>
                                        <img alt="preview" src="/images/imageEditorLarge.jpg" className="object-cover w-full h-60" />
                                    </DialogContent>
                                </Dialog>
                                <Button type="button" variant="ghost">
                                    Customise
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia optio ab facilis ad amet obcaecati magni officiis modi tempore, maiores aperiam atque sequi adipisci quos aliquid laudantium! Sint, magni architecto.
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia optio ab facilis ad amet obcaecati magni officiis modi tempore, maiores aperiam atque sequi adipisci quos aliquid laudantium! Sint, magni architecto.
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PromotionList;