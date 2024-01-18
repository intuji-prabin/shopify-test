const ExpenditureCard = () => {
    return (
        <section className="container">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <div className="space-y-2">
                    <h2>Expenditures</h2>
                    <p>A comprehensive overview of spending, detailing categories, brands, products, and transaction history for informed financial insights.</p>
                </div>
                <div>
                    <p>Select Date Range to Filter Data</p>
                </div>
            </div>
        </section>
    );
}

export default ExpenditureCard;