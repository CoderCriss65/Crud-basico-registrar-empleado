document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employeeForm');

    // Add floating label behavior
    document.querySelectorAll('.form-group input, .form-group select').forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });

        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('focused');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = {
                documento: document.getElementById('documento').value,
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                fechanacimiento: document.getElementById('fechanacimiento').value,
                telefono: document.getElementById('telefono').value,
                correo: document.getElementById('correo').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value,
                contrato: document.getElementById('contrato').value,
                jornada: document.getElementById('jornada').value
            };

            // Simulate form submission with loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';

            // Add loading animation
            submitBtn.style.opacity = '0.8';
            submitBtn.style.transform = 'scale(0.98)';

            // Simulate API call
            setTimeout(() => {
                console.log('Form submitted with data:', formData);
                
                // Show success message with animation
                submitBtn.textContent = 'Success!';
                submitBtn.classList.add('success');
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('success');
                    submitBtn.style.opacity = '';
                    submitBtn.style.transform = '';
                }, 1500);
            }, 1000);
        }
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        // Remove any existing error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        requiredFields.forEach(field => {
            field.classList.remove('error');
            field.parentElement.classList.remove('error');
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                field.parentElement.classList.add('error');
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                field.parentNode.appendChild(errorMessage);
            }
        });

        // Validate email format
        const emailField = document.getElementById('correo');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
            emailField.parentElement.classList.add('error');
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Please enter a valid email address';
            emailField.parentNode.appendChild(errorMessage);
        }

        // Validate phone number (basic validation)
        const phoneField = document.getElementById('telefono');
        const phoneRegex = /^\+?\d{10,15}$/;
        if (phoneField.value && !phoneRegex.test(phoneField.value)) {
            isValid = false;
            phoneField.classList.add('error');
            phoneField.parentElement.classList.add('error');
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Please enter a valid phone number';
            phoneField.parentNode.appendChild(errorMessage);
        }

        return isValid;
    }
});