import React, { useState } from "react";

const VehicleFilter = () => {
    const [filters, setFilters] = useState({
        location: "Entire Malaysia",
        category: "Cars",
        search: "",
        carType: "",
        brand: "",
        mileageFrom: "",
        mileageTo: "",
        yearFrom: "",
        yearTo: "",
        priceFrom: "",
        priceTo: "",
        transmission: "",
        condition: "",
        model: "",
        fuelType: "",
        titleOnly: true,
        urgent: false,
        withVideo: false,
        listingType: "sale",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSearch = () => {
        console.log("Search filters:", filters);
        // You can replace this with API call or navigation
    };

    return (
        <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            margin: "20px auto",
            width: "95%",
            borderRadius: "10px",
            fontFamily: "sans-serif"
        }}>
            {/* Top Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
                <select name="location" value={filters.location} onChange={handleChange}>
                    <option>Entire Malaysia</option>
                    <option>Selangor</option>
                    <option>Penang</option>
                </select>

                <select name="category" value={filters.category} onChange={handleChange}>
                    <option>Cars</option>
                    <option>Motorcycles</option>
                </select>

                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    placeholder="Search anything..."
                    onChange={handleChange}
                    style={{ flexGrow: 1, padding: "5px" }}
                />

                <button onClick={handleSearch} style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 15px",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}>
                    Search
                </button>
            </div>

            {/* Filters Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                    "carType", "brand", "mileageFrom", "mileageTo",
                    "yearFrom", "yearTo", "priceFrom", "priceTo",
                    "transmission", "condition", "model", "fuelType"
                ].map((field) => (
                    <select key={field} name={field} value={filters[field]} onChange={handleChange}>
                        <option>{field.replace(/([A-Z])/g, ' $1')}</option>
                    </select>
                ))}
            </div>

            {/* Checkbox Filters */}
            <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "20px" }}>
                <label>
                    <input
                        type="checkbox"
                        name="titleOnly"
                        checked={filters.titleOnly}
                        onChange={handleChange}
                    /> Search title only
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="urgent"
                        checked={filters.urgent}
                        onChange={handleChange}
                    /> Show only <strong>Urgent</strong>
                </label>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
                    <label>
                        <input
                            type="radio"
                            name="listingType"
                            value="all"
                            checked={filters.listingType === "all"}
                            onChange={handleChange}
                        /> All
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="listingType"
                            value="sale"
                            checked={filters.listingType === "sale"}
                            onChange={handleChange}
                        /> For Sale
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="listingType"
                            value="rent"
                            checked={filters.listingType === "rent"}
                            onChange={handleChange}
                        /> For Rent
                    </label>
                </div>
            </div>
        </div>
    );
};

export default VehicleFilter;
