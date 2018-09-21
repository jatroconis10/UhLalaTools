Feature: The taximeter works as expected

    Scenario: A trip with less units than the minimum corresponds to the minimum tariff with puerta a puerta
        Given I press "Paraderos"               
        #button to remove the splash screen
        When I swipe left
        #to open te menu
        And I press "Taximetro"
        Then I should see "$4.800"

    Scenario: A trip with less units than the minimum corresponds to the minimum tariff without overcharges
        Then I wait for "Inicio" to appear 
        When I swipe left              
        And I press "Taximetro"
        And I press "Puerta-Puerta"
        Then I should see "$4.100"

    Scenario: Adding units reflects correctly on the app 
        Then I wait for "Inicio" to appear 
        When I swipe left              
        And I press "Taximetro"
        Then I enter "60" into input field number 1
        Then I should see "$5.600"

    Scenario: Using all over charges alter the values correctly
        Then I wait for "Inicio" to appear 
        When I swipe left              
        And I press "Taximetro"
        And I press "Noct./Fest."
        And I press "Terminal"
        And I press "Aeropuerto"
        Then I should see "$11.400"