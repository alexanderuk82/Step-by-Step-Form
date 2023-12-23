document.addEventListener("DOMContentLoaded", function () {
	populateYearDropdown();
	const form = document.getElementById("stepForm");
	const steps = Array.from(document.getElementsByClassName("step"));
	let currentStep = 0;

	function updateProgressBar(step) {
		const progressBarFill = document.querySelector(".progress-bar-fill");
		let percentage;

		if (step === "thankYou") {
			percentage = 100; // Explicitly set to 100% for the thank you step
		} else {
			// Calculate percentage based on the current step
			const totalSteps = steps.length + 1; // Include thank you step in total
			percentage = ((currentStep + 1) / totalSteps) * 100;
		}

		progressBarFill.style.width = percentage + "%";
	}

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
			errorDiv = input.nextElementSibling; // Assumes error div immediately follows the select
		} else {
			// Validation logic for regular inputs
			isValid = input.checkValidity();
			errorDiv = input.nextElementSibling; // Assumes error div immediately follows the input
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

	window.nextStep = function () {
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
			animateToNextStep();
			showStep(currentStep);
		}
	};

	// Event animation slide out

	function animateToNextStep() {
		const currentStepElement = steps[currentStep];
		currentStepElement.classList.add("slide-out");

		setTimeout(() => {
			currentStepElement.classList.remove("slide-out");
			currentStep = Math.min(currentStep + 1, steps.length - 1);
			showStep(currentStep);
		}, 500);
	}

	window.previousStep = function () {
		currentStep = Math.max(currentStep - 1, 0);
		showStep(currentStep);
	};

	window.previousStep = function () {
		currentStep = Math.max(currentStep - 1, 0);
		showStep(currentStep);
	};

	function showThankYouStep() {
		// Hide all steps
		steps.forEach((step) => {
			step.classList.add("hidden");
		});

		// Show the thank you message
		const thankYouStep = document.getElementById("thankYouStep");
		thankYouStep.classList.remove("hidden");
		document.getElementById(
			"thankYouMessage"
		).innerHTML = `It was great assisting you today <strong>${form.firstName.value}</strong>. Our partners are now analysing your details and matching you with some affordable life insurance options.`;

		// Update the progress bar
		updateProgressBar("thankYou");
	}

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

		// Show the thank you step
		showThankYouStep();
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
