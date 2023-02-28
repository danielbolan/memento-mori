const updateDisplay = (function () {

    const days1 = document.getElementById("days1");
    const days2 = document.getElementById("days2");
    // const days3 = document.getElementById("days3");
    const days4 = document.getElementById("days4");
    const days5 = document.getElementById("days5");
    const days6 = document.getElementById("days6");

    // To make sure the calendarContainerInner always is some multiple of
    // --grid-size, we measure the size of calendarContainer determined by the
    // flex box, and then modify the width of calendarContainerInner to fit
    // the largest multiple of --grid-size smaller than calendarContainer's width.
    const calendarContainer = document.getElementById("calendarContainer");
    const calendarContainerInner = document.getElementById("calendarContainerInner");

    const daysSpentLabel = document.getElementById('spentDaysLabel');
    const totalDaysLabel = document.getElementById('totalDaysLabel');
    const lifeAsYearLabel = document.getElementById('lifeAsYearLabel');

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const dateFormatter = new Intl.DateTimeFormat('en-US', { month: "long", day: "numeric" });
    const formatNumber = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let birthday = new Date("1992-07-14");
    let spentDays = (new Date() - birthday) / millisecondsPerDay | 0;
    let expectedDays = (81.35 * 365.25) | 0;

    const updateDisplay = function (event) {
        // If the window shrinks and we don't remove the width styling from
        // the inner container, the outer container will be determined by its 
        calendarContainerInner.style.width = "";
        const overallWidth = calendarContainer.offsetWidth;
        const gridSize = parseInt(getComputedStyle(calendarContainer).getPropertyValue('--grid-size'));
        const dotWidth = (overallWidth / gridSize) | 0;
        calendarContainerInner.style.width = dotWidth * gridSize + 'px';

        const fractionOfLife = spentDays / expectedDays;
        const lifeAsDay = new Date(millisecondsPerDay * 365 * fractionOfLife);

        // Update copy text
        daysSpentLabel.innerText = formatNumber(spentDays);
        totalDaysLabel.innerText = formatNumber(expectedDays);
        lifeAsYearLabel.innerText = dateFormatter.format(lifeAsDay);
        if (1 < fractionOfLife && fractionOfLife < 2) {
            lifeAsYearLabel.innerText += " the next year";
        } else if (fractionOfLife >= 2) {
            lifeAsYearLabel.innerText += ", " + (fractionOfLife | 0) + " years later. Not sure how I managed this, but here we are";
        }

        /*
        layout:
        
        11111111
        11111111
        --------
        222|3|44
        --------
        55555555
        55555555
        --------
        66666|
        
        */
        const days1DotHeight = (spentDays / dotWidth) | 0;
        days1.style.height = days1DotHeight * gridSize + 'px';

        const days2DotWidth = (spentDays % dotWidth) | 0;
        days2.style.width = days2DotWidth * gridSize + 'px';

        if (spentDays > expectedDays) {
            days4.style.height = '0px';
            days5.style.height = '0px';
            days6.style.height = '0px';
            return;
        }

        days4.style.height = gridSize + 'px';

        let days5DotHeight = expectedDays;
        days5DotHeight -= spentDays + days2DotWidth;
        days5DotHeight /= dotWidth;
        days5DotHeight |= 0;
        days5.style.height = days5DotHeight * gridSize + 'px';

        const days6DotWidth = expectedDays % dotWidth | 0
        days6.style.width = days6DotWidth * gridSize + 'px';
    };

    const updateBirthday = function (event) {
        birthday = event.target.valueAsDate;
        const today = new Date();
        if (today < birthday) {
            birthday = today;
            event.target.valueAsDate = today;
        }
        spentDays = (new Date() - birthday) / millisecondsPerDay | 0;
        updateDisplay();
    };
    const birthdayInput = document.getElementById("birthdayInput");
    birthdayInput.valueAsDate = birthday;
    birthdayInput.addEventListener("change", updateBirthday);

    const updateLifeExpectancy = function (event) {
        let newLifeExpectancy = Number(event.target.value);
        if (isNaN(newLifeExpectancy)) return;
        expectedDays = newLifeExpectancy * 365.25 | 0;
        if (expectedDays <= 0) {
            expectedDays = 1;
        }
        updateDisplay();
    }
    const lifeExpectancyInput = document.getElementById("lifeExpectancyInput");
    lifeExpectancyInput.value = (expectedDays / 365.25).toFixed(2);
    lifeExpectancyInput.addEventListener("change", updateLifeExpectancy);

    addEventListener("resize", updateDisplay);
    return updateDisplay;
})();

updateDisplay();