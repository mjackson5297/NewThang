var data = [];
var userName = "Clerk, Postal";
var fullName = "Postal Clerk";
var userLastFirst = "Clerk, Postal"

function prepareData() {

    console.log("preparing test questions...")

    var name = userName.split(', ');
    var firstName = name[1];
    var lastName = name[0];
    var initials = firstName.charAt(0) + lastName.charAt(0);
    fullName = firstName + " " + lastName;

    document.querySelector("#studentName").innerText = fullName;
    document.querySelector("#studentInitials").innerText = initials;


    var questionData = [

        {
            s: "1",
            f: "example",
            q: "dropdown-example",
            a: ["incorrect answer", "correct answer", "incorrect answer"],
            c: "correct answer",
            t: "dropdown",
            h: "Select the correct answer.",
        },
        {
            s: "1",
            f: "example",
            q: "checkbox-example",
            a: ["true", "false"],
            c: "true",
            t: "checkbox",
            l: "Check this box",
            h: "Check this box.",
        }

        // Blank Answer Templates

        // Dropdown
        // {
        //     s: "your-situation-number",
        //     f: "form-name",
        //     q: "question-id",
        //     a: ['option1', 'option2', 'option3'],
        //     c: 'correct-answer,
        //     t: "dropdown",
        //     h: "Your Hover Text",
        // },

        // Checkbox
        // {
        //     s: "your-situation-number",
        //     f: "form-name",
        //     q: "question-id",
        //     a: ["true", "false"],
        //     c: "true",
        //     t: "checkbox",
        //     l: "Your Checkbox Text",
        //     h: "Your Checkbox Hover Text",
        // },
    ];

    for (var i = 0; i < questionData.length; i++) {
        data.push(questionData[i]);
    }
}