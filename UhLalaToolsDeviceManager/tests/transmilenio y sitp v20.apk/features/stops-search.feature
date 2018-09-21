Feature: The search for a specific station works as expected

    Scenario: Without searching I get a list of all stops
        Given I press "Paraderos"               
        #button to remove the splash screen
        And I press "Paraderos"
        Then I should see "21 Ángeles"

    Scenario: Searching for a non existent station doesn't return any results
        Then I wait for "Inicio" to appear
        When I press "Paraderos"
        And I press "Buscar"
        Then I enter "No existe" into input field number 1
        And I press the enter button
        And I clear input field number 1
        And I should not see "No existe"

    Scenario: Searching for a existent station returns the correct result
        Then I wait for "Inicio" to appear
        When I press "Paraderos"
        And I press "Buscar"
        Then I enter "Calle 26" into input field number 1
        And I press the enter button
        And I clear input field number 1
        And I should see "Calle 26" 