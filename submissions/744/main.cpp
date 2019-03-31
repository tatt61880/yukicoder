#include <iostream>
using namespace std;

int main(){
    int N;
    cin >> N;
    int arr[] = {4, 2, 8, 5, 7, 1};
    cout << arr[N % 6] << endl;
    return 0;
}