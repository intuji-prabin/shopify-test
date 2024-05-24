
const ExpenditureTab = ({ dynamicDates, setActiveTab, activeTab }: { dynamicDates: any, setActiveTab: any, activeTab: string }) => {
    const handleDate = (tabName: string) => {
        setActiveTab(tabName);
    };
    return (
        <>
            {dynamicDates.map((item: any) => {
                const abbreviation = Object.keys(item)[0];
                const fullForm = item[abbreviation];
                return (
                    <div className={activeTab === abbreviation ? 'bg-primary-200 text-primary-500' : 'text-grey-400'
                    } key={abbreviation}>
                        <p className="py-[3px] text-sm text-center cursor-pointer my-auto h-full flex items-center justify-center" onClick={() => handleDate(abbreviation)}>
                            {fullForm}
                        </p>
                    </div>
                );
            })}
        </>
    );
}

export default ExpenditureTab;