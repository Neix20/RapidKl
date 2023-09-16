import React, { useState, useEffect } from "react";

function Index(value = false) {
    const [flag, setFlag] = useState(value);
    const toggleFlag = () => setFlag((val) => !val);

    return [flag, setFlag, toggleFlag];
}

export default Index;