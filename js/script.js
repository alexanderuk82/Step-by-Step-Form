document.addEventListener("DOMContentLoaded", function () {
	populateYearDropdown();
	populateHowLongDropdown();
	populateHowMuchDropdown();
	const form = document.getElementById("stepForm");
	const steps = Array.from(document.getElementsByClassName("step"));
	let currentStep = 0;

	// Add event listeners to all radio buttons to move to the next step when clicked
	const radioButtons = document.querySelectorAll('input[type="radio"]');
	radioButtons.forEach((radio) => {
		radio.addEventListener("click", function () {
			if (this.checked) {
				nextStep();
			}
		});
	});

	// Event listener for input fields Validation

	function validateInput(input) {
		let errorDiv;
		let isValid;

		if (input.type === "radio") {
			// Validation logic for radio buttons
			const radioGroup = document.querySelectorAll(
				`input[name="${input.name}"]`
			);
			isValid = Array.from(radioGroup).some((radio) => radio.checked);
			errorDiv = document.getElementById(`error-${input.name}`);
		} else if (input.tagName === "SELECT") {
			// Validation logic for select dropdowns

			isValid = input.value !== ""; // Check if a non-placeholder value is selected
			errorDiv = input.nextElementSibling;
		} else {
			// Validation logic for regular inputs
			isValid = input.checkValidity();
			errorDiv = input.nextElementSibling;
		}

		// Handling the display of error messages

		if (!isValid) {
			input.classList.add("input-error");
			input.classList.remove("input-valid");
			errorDiv.textContent = input.dataset.errorMessage;
			errorDiv.style.display = "block";
		} else {
			input.classList.remove("input-error");
			input.classList.add("input-valid");
			errorDiv.style.display = "none";
		}

		return isValid;
	}

	// Event listener for input fields Validation

	function showStep(step) {
		steps.forEach((s, index) => {
			s.classList.toggle("hidden", index !== step);
		});
		if (step === 1) {
			document.getElementById(
				"greeting"
			).innerHTML = `Nice to meet you <strong>${form.firstName.value}</strong>, what's your email address?`;
		}
		if (step === 7) {
			document.getElementById(
				"intersted"
			).innerHTML = `<strong>${form.firstName.value}</strong>, are you interested in adding critical Illness cover?`;
		}

		if (step === steps.length) {
			// Adjust for the new thank you step
			document.getElementById(
				"thankYouMessage"
			).textContent = `Thank you, <strong>${form.firstName.value}</strong>! Congratulations on completing the form.`;
		}
		updateProgressBar();
	}

	// Window next step function

	window.nextStep = async function () {
		const currentInputs = steps[currentStep].querySelectorAll(
			"input[required], select[required], radio[required]"
		);
		let allValid = true;

		currentInputs.forEach((input) => {
			if (!validateInput(input)) {
				allValid = false;
			}
		});

		// If all inputs are valid, proceed to the next step

		if (allValid) {
			await animateToNextStep();

			// Update progress bar after moving to the next step
			updateProgressBar();
		}
	};

	// Event animation slide out

	function animateToNextStep() {
		return new Promise((resolve) => {
			const currentStepElement = steps[currentStep];
			currentStepElement.classList.add("slide-out-left-to-right");

			setTimeout(() => {
				currentStepElement.classList.remove("slide-out-left-to-right");
				currentStep = Math.min(currentStep + 1, steps.length - 1);
				showStep(currentStep);
				resolve();
			}, 500);
		});
	}

	window.previousStep = function () {
		if (currentStep > 0) {
			const currentStepElement = steps[currentStep];
			currentStepElement.classList.add("slide-out");

			setTimeout(() => {
				currentStepElement.classList.remove("slide-out");
				currentStep = Math.max(currentStep - 1, 0);
				showStep(currentStep);

				const newStepElement = steps[currentStep];
				newStepElement.classList.add("slide-in-right-to-left");

				setTimeout(() => {
					newStepElement.classList.remove("slide-in-right-to-left");
				}, 500);
			}, 500);
		}
	};

	// Progress Bar Function

	function updateProgressBar() {
		const progressBarFill = document.querySelector(".progress-bar-fill");
		// Calculate percentage based on the current step
		const totalSteps = steps.length; // Total number of steps without including the thank you step
		let percentage = (currentStep / (totalSteps - 1)) * 100;
		progressBarFill.style.width = percentage + "%";
	}

	// Form Submit Function

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		const accepted = document.getElementById("termsCheckbox").checked;
		const selectedGender = form.querySelector(
			'input[name="gender"]:checked'
		)?.value;
		const selectedSmoker = form.querySelector(
			'input[name="smoker"]:checked'
		)?.value;
		const selectedInsurance = form.querySelector(
			'input[name="insurance"]:checked'
		)?.value;

		// Getting values from the DOB dropdowns
		const dobMonth = form.dobMonth.value;
		const dobDay = form.dobDay.value;
		const dobYear = form.dobYear.value;

		// Getting values from the Policy dropdowns

		const howmuch = form.howmuch.value;
		const howlong = form.howlong.value;

		const formData = {
			firstName: form.firstName.value,
			surname: form.surname.value,
			email: form.email.value,
			accepted,
			gender: selectedGender,
			insurance: selectedInsurance,
			dob: `${dobMonth}/${dobDay}/${dobYear}`,
			smoker: selectedSmoker,
			howmuch: `£${howmuch}`,
			howlong: `${howlong} years`,
			phone: form.phone.value,
			postcode: form.postcode.value,
		};

		console.log("Form Data:", formData);
		// Send data to the backend here

		// Store the user's first name in Local Storage
		localStorage.setItem("userName", formData.firstName);

		// Redirect to the thank you page after processing the form data
		window.location.href = "/thankyou.html";
	});
});
// Year Function

function populateYearDropdown() {
	const yearDropdown = document.getElementById("dobYear");
	const currentYear = new Date().getFullYear();

	for (let year = currentYear; year >= 1900; year--) {
		let option = document.createElement("option");
		option.value = year;
		option.textContent = year;
		yearDropdown.appendChild(option);
	}
}
// How Much value dropdown

function populateHowMuchDropdown() {
	const howMuchDropdown = document.getElementById("howmuch");
	const amounts = [
		30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 150000, 200000,
		250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000,
		700000, 750000, 800000, 850000, 900000, 950000, 1000000,
	];

	amounts.forEach((amount) => {
		let option = document.createElement("option");
		option.value = amount;
		if (amount === 1000000) {
			option.textContent = "£1million+";
		} else {
			option.textContent = `£${amount.toLocaleString()}`;
		}

		if (amount === 150000) {
			option.selected = true;
		}

		howMuchDropdown.appendChild(option);
	});
}

// How Long value dropdown
function populateHowLongDropdown() {
	const howLongDropdown = document.getElementById("howlong");

	// Start from 5 years and end at 72 years
	for (let year = 5; year <= 72; year++) {
		let option = document.createElement("option");
		option.value = year;
		option.textContent = `${year} years`;

		// Set default value to 20 years
		if (year === 20) {
			option.selected = true;
		}

		howLongDropdown.appendChild(option);
	}
}
