import { useEffect, useState } from "react";

const ExpenditureTab = ({ dynamicDates }: { dynamicDates: any }) => {
    const [activeTab, setActiveTab] = useState("");

    const handleDate = (tabName: string) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
        setActiveTab(dynamicDates[0]);
    }, []);
    return (
        <>
            {dynamicDates.map((tabName: string) => (
                <div className={activeTab === tabName ? 'bg-primary-200 text-primary-500' : 'text-grey-400'
                } key={tabName}>
                    <p
                        className="py-[3px] text-sm text-center cursor-pointer my-auto h-full flex items-center justify-center"
                        onClick={() => handleDate(tabName)}
                    >
                        {tabName}
                    </p>
                </div>
            ))
            }
        </>
    );
}

export default ExpenditureTab;