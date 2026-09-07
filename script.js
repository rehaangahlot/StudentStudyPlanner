document.addEventListener("DOMContentLoaded", function () {


    // =====================================
    // PROGRESS BAR
    // =====================================

    const progressBar =
        document.getElementById("progressBar");


    if (progressBar) {

        let progress =
            Number(
                progressBar.getAttribute("data-progress")
            );


        if (isNaN(progress)) {
            progress = 0;
        }


        progress =
            Math.max(
                0,
                Math.min(100, progress)
            );


        progressBar.style.width =
            progress + "%";

    }


    // =====================================
    // SEARCH
    // =====================================

    const searchInput =
        document.getElementById("searchInput");

    const taskCards =
        document.querySelectorAll(".task-card");


    let currentFilter = "all";


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterTasks
        );

    }


    // =====================================
    // FILTER BUTTONS
    // =====================================

    const filterButtons =
        document.querySelectorAll(".filter-button");


    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {


                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove("active");

                    }
                );


                button.classList.add("active");


                currentFilter =
                    button.getAttribute(
                        "data-filter"
                    );


                filterTasks();

            }
        );

    });


    // =====================================
    // FILTER TASKS
    // =====================================

    function filterTasks() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const now = new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                now.getDate()
            ).padStart(2, "0");


        const today =
            year + "-" + month + "-" + day;


        taskCards.forEach(function (card) {

            const subject =
                card.getAttribute(
                    "data-subject"
                ) || "";


            const topic =
                card.getAttribute(
                    "data-topic"
                ) || "";


            const status =
                card.getAttribute(
                    "data-status"
                ) || "";


            const taskDate =
                card.getAttribute(
                    "data-date"
                ) || "";


            const matchesSearch =
                subject.includes(searchText) ||
                topic.includes(searchText);


            let matchesFilter = true;


            if (currentFilter === "completed") {

                matchesFilter =
                    status === "completed";

            }


            else if (currentFilter === "pending") {

                matchesFilter =
                    status === "pending";

            }


            else if (currentFilter === "today") {

                matchesFilter =
                    taskDate === today;

            }


            if (
                matchesSearch &&
                matchesFilter
            ) {

                card.style.display = "flex";

            }

            else {

                card.style.display = "none";

            }

        });

    }


    // =====================================
    // CALENDAR
    // =====================================

    const calendarDays =
        document.getElementById("calendarDays");

    const monthYear =
        document.getElementById("monthYear");

    const previousMonth =
        document.getElementById("previousMonth");

    const nextMonth =
        document.getElementById("nextMonth");


    let calendarDate = new Date();


    function createCalendar() {

        if (!calendarDays || !monthYear) {
            return;
        }


        calendarDays.innerHTML = "";


        const year =
            calendarDate.getFullYear();


        const month =
            calendarDate.getMonth();


        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];


        monthYear.textContent =
            monthNames[month] + " " + year;


        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        // Empty spaces before first day

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const empty =
                document.createElement("div");

            empty.className =
                "calendar-day empty";

            calendarDays.appendChild(empty);

        }


        // Create days

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const dayElement =
                document.createElement("div");


            dayElement.className =
                "calendar-day";


            const dateString =
                year +
                "-" +
                String(month + 1).padStart(2, "0") +
                "-" +
                String(day).padStart(2, "0");


            dayElement.textContent = day;


            // Highlight today

            const today =
                new Date();


            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {

                dayElement.classList.add(
                    "today"
                );

            }


            // Check for tasks

            let hasTask = false;


            taskCards.forEach(function (task) {

                if (
                    task.getAttribute(
                        "data-date"
                    ) === dateString
                ) {

                    hasTask = true;

                }

            });


            if (hasTask) {

                dayElement.classList.add(
                    "has-task"
                );

            }


            calendarDays.appendChild(
                dayElement
            );

        }

    }


    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            function () {

                calendarDate.setMonth(
                    calendarDate.getMonth() - 1
                );

                createCalendar();

            }
        );

    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            function () {

                calendarDate.setMonth(
                    calendarDate.getMonth() + 1
                );

                createCalendar();

            }
        );

    }


    createCalendar();

});