const filterForm = document.getElementById('form');
filterForm.addEventListener('change', function(e){
    e.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const travelers = document.getElementById('stops').value;
    console.log(from);
    
    const filterData = {
        from,
        to,
        travelers,
    };
     localStorage.setItem("filterData", JSON.stringify(filterData));
})

const dataFilter = localStorage.getItem('filterData')




